"""
Did the fin survive slicing?

    python3 check_gcode.py sliced.gcode fins.stl

Reads the extruding moves out of the G-code, registers them against the STL's
own coordinates (slicers re-centre onto the bed), and reports what got printed
inside each fin's footprint, layer by layer.

Watertight geometry is necessary but not sufficient: a fin that is too thin for
the nozzle, or that the slicer decides is a separate floating object, simply
does not appear in the toolpaths. That is invisible to every mesh-level check in
this repo, and it is the thing a test print would otherwise discover.
"""
import sys
import re
import numpy as np
import trimesh

MOVE = re.compile(r'^G[01]\s')


def read_moves(path):
    """Extruding XY segments and their layer z."""
    x = y = z = 0.0
    out = []
    with open(path) as fh:
        for line in fh:
            if not MOVE.match(line):
                continue
            nx, ny, nz, e = x, y, z, None
            for tok in line.split(';')[0].split()[1:]:
                c, v = tok[0], tok[1:]
                try:
                    v = float(v)
                except ValueError:
                    continue
                if c == 'X': nx = v
                elif c == 'Y': ny = v
                elif c == 'Z': nz = v
                elif c == 'E': e = v
            if e is not None and e > 0 and (nx != x or ny != y):
                out.append((z, x, y, nx, ny))
            x, y, z = nx, ny, nz
    return np.array(out) if out else np.zeros((0, 5))


def main(gcode, fins_stl):
    mv = read_moves(gcode)
    if not len(mv):
        print('перемещения с экструзией не найдены')
        return 1

    m = trimesh.load(fins_stl, force='mesh')
    bodies = m.split(only_watertight=False)
    walls = [b for b in bodies if b.volume > 20 and len(b.vertices) < 40]
    bases = [b for b in bodies if b.volume > 20 and len(b.vertices) >= 40]
    tines = [b for b in bodies if b.volume < 5]

    # register: the slicer re-centres the model on the bed, so line up centroids
    gx = (mv[:, 1].min() + mv[:, 3].max()) / 2
    gy = (mv[:, 2].min() + mv[:, 4].max()) / 2
    print(f'{len(mv)} перемещений с экструзией, {len(np.unique(mv[:, 0]))} слоёв, '
          f'z до {mv[:, 0].max():.1f}мм')
    print(f'совмещено с центром стола ({gx:.1f}, {gy:.1f})\n')

    for i, w in enumerate(walls):
        lo, hi = w.bounds
        # the wall is a thin blade; widen the test box by a nozzle so a bead
        # laid on its centreline still counts
        pad = 0.5
        # clamp to the wall's own z range too: the part usually continues far
        # above the fin and would otherwise be counted as fin toolpath
        inbox = ((mv[:, 1] - gx >= lo[0] - pad) & (mv[:, 1] - gx <= hi[0] + pad) &
                 (mv[:, 2] - gy >= lo[1] - pad) & (mv[:, 2] - gy <= hi[1] + pad) &
                 (mv[:, 0] >= lo[2] - 0.01) & (mv[:, 0] <= hi[2] + 0.01))
        zs = mv[inbox, 0]
        print(f'РЕБРО {i + 1}: габариты стенки x {lo[0]:.1f}..{hi[0]:.1f}  '
              f'y {lo[1]:.1f}..{hi[1]:.1f}  z {lo[2]:.1f}..{hi[2]:.1f}')
        if not len(zs):
            print('   В ЭТОЙ ПРОЕКЦИИ НИЧЕГО НЕ НАПЕЧАТАНО\n')
            continue
        layers = np.unique(zs)
        expect = (hi[2] - lo[2]) / 0.2
        print(f'   {inbox.sum()} перемещений на {len(layers)} слоях, '
              f'z {zs.min():.2f}..{zs.max():.2f}')
        print(f'   высота стенки {hi[2] - lo[2]:.1f}мм => ~{expect:.0f} слоёв ожидается, '
              f'{len(layers)} напечатано ({100 * len(layers) / expect:.0f}%)')
        print(f'   верхний напечатанный слой {zs.max():.2f}; верх ребра {hi[2]:.2f}'
              f'  ({100 * zs.max() / hi[2]:.0f}% высоты ребра)\n')

    for i, b in enumerate(bases):
        lo, hi = b.bounds
        inbox = ((mv[:, 1] - gx >= lo[0]) & (mv[:, 1] - gx <= hi[0]) &
                 (mv[:, 2] - gy >= lo[1]) & (mv[:, 2] - gy <= hi[1]) &
                 (mv[:, 0] <= 1.05))
        print(f'ОСНОВАНИЕ {i + 1}: {inbox.sum()} перемещений в первом 1мм '
              f'(диск, удерживающий ребро на столе)')

    print(f'\n{len(tines)} перемычек в сетке; высота каждой {0.3}мм, поэтому при слое '
          f'0.2мм каждая занимает 1-2 слоя')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1], sys.argv[2]))
