#!/usr/bin/env python3
"""Generates scene.rml for the walking-puppy Rive demo.

Build the .riv with the Rive CLI:
    python3 generate_scene.py && rive . --verify && rive . --screenshot=preview.png --advance=1s

The scene is written as code because the street repeats: buildings, sidewalk
tiles and lane dashes are tiled in loops and scrolled to make the puppy walk.
"""
from pathlib import Path

W, H = 600, 600
GROUND_Y = 400          # where the puppy's paws touch the sidewalk
PUPPY_X = 300

_next_id = 100


def new_id():
    global _next_id
    _next_id += 1
    return f"0:{_next_id}"


def fill(color, name="Fill"):
    return f'<Fill name="{name}"><SolidColor colorValue="{color}" name="Color"/></Fill>'


def ellipse(name, x, y, w, h, color, rot=0.0, sid=None):
    ida = f' id="{sid}"' if sid else ""
    rota = f' rotation="{rot}"' if rot else ""
    return (f'<Shape x="{x}" y="{y}"{rota} name="{name}"{ida}>'
            f'<Ellipse width="{w}" height="{h}" name="Path"/>{fill(color)}</Shape>')


def rect(name, x, y, w, h, color, r=0.0, rot=0.0, origin_y=0.5, sid=None):
    ida = f' id="{sid}"' if sid else ""
    rota = f' rotation="{rot}"' if rot else ""
    radius = (f' cornerRadiusTL="{r}" cornerRadiusTR="{r}" cornerRadiusBL="{r}"'
              f' cornerRadiusBR="{r}"') if r else ""
    return (f'<Shape x="{x}" y="{y}"{rota} name="{name}"{ida}>'
            f'<Rectangle width="{w}" height="{h}" originY="{origin_y}"{radius} name="Path"/>'
            f'{fill(color)}</Shape>')


def keys(prop, frames, interp="linear"):
    kfs = "".join(f'<KeyFrameDouble frame="{f}" value="{v}" interpolationType="{interp}"/>'
                  for f, v in frames)
    return f'<KeyedProperty property="{prop}">{kfs}</KeyedProperty>'


def keyed(obj_id, *props):
    return f'<KeyedObject objectId="{obj_id}">{"".join(props)}</KeyedObject>'


# ---------------------------------------------------------------- ids we key
ID_ARTBOARD, ID_STYLE, ID_SM, ID_JUMP = "0:2", "0:3", "0:4", "0:5"
ID_CITY, ID_GROUND = "0:10", "0:11"
ID_PUPPY, ID_BODY, ID_HEAD, ID_TAIL = "0:20", "0:21", "0:22", "0:23"
ID_LEG_BF, ID_LEG_FF, ID_LEG_BN, ID_LEG_FN = "0:24", "0:25", "0:26", "0:27"
ID_EAR_N, ID_EAR_F, ID_SHADOW = "0:28", "0:29", "0:30"
ID_ANIM_CITY, ID_ANIM_GROUND, ID_ANIM_WALK, ID_ANIM_JUMP = "0:40", "0:41", "0:42", "0:43"
ID_ST_WALK, ID_ST_JUMP = "0:50", "0:51"

# ------------------------------------------------------------------- scenery
# Buildings repeat every 240px and scroll at half the ground speed (parallax).
BUILDINGS = [  # x within period, width, height, color
    (40, 90, 170, "FFF4A99B"),
    (150, 70, 120, "FFA8D5BA"),
    (205, 40, 90, "FF9EC1E8"),
]
city = []
for period in range(4):
    for bx, bw, bh, col in BUILDINGS:
        cx = period * 240 + bx
        city.append(rect("Building", cx, 360 - bh / 2, bw, bh, col, r=6))
        # windows: a small grid of soft white panes
        cols = max(1, int((bw - 16) // 22))
        rows = max(1, int((bh - 30) // 30))
        for c in range(cols):
            for rr in range(rows):
                wx = cx - (cols - 1) * 11 + c * 22
                wy = 360 - bh + 22 + rr * 30
                city.append(rect("Window", wx, wy, 12, 14, "AAFFFFFF", r=2))
city_node = f'<Node x="0" y="0" name="City" id="{ID_CITY}">{"".join(city)}</Node>'

# Sidewalk tile seams (every 60px) and lane dashes (every 120px) share one node
# that scrolls 120px per loop, so the ground appears to slide under the puppy.
ground = []
for k in range(13):
    ground.append(rect("Seam", k * 60, 380, 3, 40, "FFC4BBAB"))
for k in range(7):
    ground.append(rect("Dash", k * 120 + 30, 505, 56, 8, "FFF5F0E1", r=4))
ground_node = f'<Node x="0" y="0" name="Ground" id="{ID_GROUND}">{"".join(ground)}</Node>'

scenery = "".join([
    ellipse("Sun", 480, 105, 74, 74, "FFFFE08A"),
    ellipse("Cloud", 130, 95, 110, 40, "FFFFFFFF"),
    ellipse("Cloud", 165, 80, 70, 44, "FFFFFFFF"),
    ellipse("Cloud", 400, 160, 90, 30, "F0FFFFFF"),
    city_node,
    rect("Sidewalk", W / 2, 380, W, 40, "FFE3DCCF"),
    rect("Curb", W / 2, 404, W, 8, "FFB8AE9C"),
    rect("Road", W / 2, 508, W, 200, "FF5B5F6B"),
    ground_node,
])

# --------------------------------------------------------------------- puppy
TAN, TAN_DARK, CREAM, BROWN, INK = "FFF2C48D", "FFD9A66B", "FFFBE6C8", "FFB5733A", "FF2B1D16"

head = "".join([
    ellipse("Ear Far", 18, -16, 26, 46, BROWN, rot=-0.35, sid=ID_EAR_F),
    ellipse("Head", 0, 0, 84, 76, TAN),
    ellipse("Snout", 26, 14, 46, 32, CREAM),
    ellipse("Nose", 46, 6, 18, 13, INK),
    ellipse("Tongue", 32, 31, 10, 12, "FFFF7A8A"),
    ellipse("Eye", 12, -8, 11, 14, INK),
    ellipse("Eye Shine", 14, -11, 4, 4, "FFFFFFFF"),
    ellipse("Cheek", 6, 12, 15, 9, "88FF8FA3"),
    ellipse("Ear Near", -20, -6, 28, 50, BROWN, rot=0.35, sid=ID_EAR_N),
])

body = "".join([
    rect("Back Leg Far", -40, 15, 15, 40, TAN_DARK, r=7, origin_y=0, sid=ID_LEG_BF),
    rect("Front Leg Far", 35, 15, 15, 40, TAN_DARK, r=7, origin_y=0, sid=ID_LEG_FF),
    rect("Tail", -60, -14, 12, 38, TAN, r=6, rot=-0.6, origin_y=1, sid=ID_TAIL),
    ellipse("Torso", 0, 0, 130, 72, TAN),
    ellipse("Belly", 6, 18, 80, 30, CREAM),
    ellipse("Spot", -30, -14, 36, 26, "FFC98B4E"),
    rect("Back Leg Near", -30, 18, 17, 42, TAN, r=8, origin_y=0, sid=ID_LEG_BN),
    rect("Front Leg Near", 45, 18, 17, 42, TAN, r=8, origin_y=0, sid=ID_LEG_FN),
    rect("Collar", 50, -18, 10, 46, "FFE5484D", r=5, rot=0.3),
    ellipse("Tag", 57, 8, 12, 12, "FFFFC83D"),
    f'<Node x="70" y="-40" name="Head Group" id="{ID_HEAD}">{head}</Node>',
])

puppy = (ellipse("Shadow", PUPPY_X, GROUND_Y + 2, 150, 16, "30000000", sid=ID_SHADOW)
         + f'<Node x="{PUPPY_X}" y="0" name="Puppy" id="{ID_PUPPY}">'
         + f'<Node x="0" y="340" name="Body" id="{ID_BODY}">{body}</Node></Node>')

# ---------------------------------------------------------------- animations
SWING = 0.32
walk = (f'<LinearAnimation name="Walk" loopValue="loop" duration="60" fps="60" id="{ID_ANIM_WALK}">'
        + keyed(ID_LEG_FN, keys("rotation", [(0, SWING), (30, -SWING), (60, SWING)]))
        + keyed(ID_LEG_BF, keys("rotation", [(0, SWING), (30, -SWING), (60, SWING)]))
        + keyed(ID_LEG_FF, keys("rotation", [(0, -SWING), (30, SWING), (60, -SWING)]))
        + keyed(ID_LEG_BN, keys("rotation", [(0, -SWING), (30, SWING), (60, -SWING)]))
        + keyed(ID_BODY, keys("y", [(0, 340), (15, 337), (30, 340), (45, 337), (60, 340)]))
        + keyed(ID_TAIL, keys("rotation", [(0, -0.45), (15, -0.95), (30, -0.45), (45, -0.95), (60, -0.45)]))
        + keyed(ID_HEAD, keys("rotation", [(0, 0), (30, 0.05), (60, 0)]))
        + keyed(ID_EAR_N, keys("rotation", [(0, 0.35), (15, 0.45), (30, 0.35), (45, 0.45), (60, 0.35)]))
        + keyed(ID_PUPPY, keys("y", [(0, 0), (60, 0)]))
        + keyed(ID_SHADOW, keys("scaleX", [(0, 1), (60, 1)]), keys("scaleY", [(0, 1), (60, 1)]))
        + '</LinearAnimation>')

# A parabolic hop: up 110px and back down in 40 frames, then a small bounce.
arc = [(f, round(-110 * (1 - ((f - 20) / 20) ** 2), 1)) for f in range(0, 41, 4)]
hop = arc + [(45, -6), (50, 0)]
shadow = [(0, 1), (20, 0.55), (40, 1), (50, 1)]
tuck = 0.75
jump = (f'<LinearAnimation name="Jump" loopValue="oneShot" duration="50" fps="60" id="{ID_ANIM_JUMP}">'
        + keyed(ID_PUPPY, keys("y", hop))
        + keyed(ID_BODY, keys("y", [(0, 340), (50, 340)]))
        + keyed(ID_LEG_FN, keys("rotation", [(0, 0), (12, -tuck), (34, -tuck), (42, 0), (50, 0)]))
        + keyed(ID_LEG_FF, keys("rotation", [(0, 0), (12, -tuck), (34, -tuck), (42, 0), (50, 0)]))
        + keyed(ID_LEG_BN, keys("rotation", [(0, 0), (12, tuck), (34, tuck), (42, 0), (50, 0)]))
        + keyed(ID_LEG_BF, keys("rotation", [(0, 0), (12, tuck), (34, tuck), (42, 0), (50, 0)]))
        + keyed(ID_TAIL, keys("rotation", [(0, -0.5), (10, -1.3), (30, -1.3), (50, -0.5)]))
        + keyed(ID_HEAD, keys("rotation", [(0, 0), (10, -0.12), (30, -0.12), (44, 0.04), (50, 0)]))
        + keyed(ID_EAR_N, keys("rotation", [(0, 0.35), (16, -0.5), (32, -0.3), (42, 0.6), (50, 0.35)]))
        + keyed(ID_SHADOW, keys("scaleX", shadow), keys("scaleY", shadow))
        + '</LinearAnimation>')

city_anim = (f'<LinearAnimation name="City Scroll" loopValue="loop" duration="480" fps="60" id="{ID_ANIM_CITY}">'
             + keyed(ID_CITY, keys("x", [(0, 0), (480, -240)])) + '</LinearAnimation>')
ground_anim = (f'<LinearAnimation name="Ground Scroll" loopValue="loop" duration="120" fps="60" id="{ID_ANIM_GROUND}">'
               + keyed(ID_GROUND, keys("x", [(0, 0), (120, -120)])) + '</LinearAnimation>')


def looping_layer(name, anim_id):
    sid = new_id()
    return (f'<StateMachineLayer name="{name}" id="{new_id()}">'
            '<AnyState x="200" y="-120"/><ExitState x="400" y="-120"/>'
            f'<EntryState><StateTransition stateToId="{sid}"/></EntryState>'
            f'<AnimationState x="200" animationId="{anim_id}" id="{sid}"/>'
            '</StateMachineLayer>')


state_machine = (
    f'<StateMachine name="Puppy" id="{ID_SM}">'
    f'<StateMachineTrigger name="jump" id="{ID_JUMP}"/>'
    + looping_layer("City", ID_ANIM_CITY)
    + looping_layer("Ground", ID_ANIM_GROUND)
    + f'<StateMachineLayer name="Puppy" id="{new_id()}">'
    '<AnyState x="200" y="-120"/><ExitState x="400" y="-120"/>'
    f'<EntryState><StateTransition stateToId="{ID_ST_WALK}"/></EntryState>'
    f'<AnimationState x="200" animationId="{ID_ANIM_WALK}" id="{ID_ST_WALK}">'
    f'<StateTransition stateToId="{ID_ST_JUMP}" duration="80">'
    f'<TransitionTriggerCondition inputId="{ID_JUMP}"/></StateTransition>'
    '</AnimationState>'
    f'<AnimationState x="200" y="150" animationId="{ID_ANIM_JUMP}" id="{ID_ST_JUMP}">'
    # exit-time transition back to walking once the hop finishes
    f'<StateTransition stateToId="{ID_ST_WALK}" duration="150" flags="12" exitTime="100"/>'
    '</AnimationState>'
    '</StateMachineLayer>'
    '</StateMachine>')

doc = (
    '<Rive version="1" kind="fragment">\n'
    f'<Artboard defaultStateMachineId="{ID_SM}" styleId="{ID_STYLE}" width="{W}" height="{H}" '
    f'name="Puppy Street" id="{ID_ARTBOARD}">\n'
    f'<LayoutComponentStyle name="Artboard Style" id="{ID_STYLE}"/>\n'
    f'{fill("FFBFE6FF", "Sky")}\n'
    f'{scenery}\n{puppy}\n{state_machine}\n{walk}\n{jump}\n{city_anim}\n{ground_anim}\n'
    '</Artboard>\n</Rive>\n')

Path(__file__).with_name("scene.rml").write_text(doc)
print("wrote scene.rml")
