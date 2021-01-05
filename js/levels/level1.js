import { Level } from "../Level.js";
import { Player } from "../objects/Player.js";
import { Rectangle } from "../objects/Rectangle.js";
import { Box } from "../objects/Box.js";
import { Goal } from "../objects/Goal.js";

export const level1 = new Level({
    size: [1000, 1000],
    objects: [
        new Goal({ pos: [800, 100], size: [50, 50], color: "black" }),
        new Player({ pos: [30, 800], size: [40, 40] }),
        new Rectangle({ pos: [500, 500], size: [200, 10], color: "blue" }),
        new Rectangle({ pos: [800, 700], size: [50, 10], color: "blue" }),
        new Rectangle({ pos: [120, 850], size: [10, 150], color: "blue" }),
        new Rectangle({ pos: [700, 900], size: [300, 10], color: "blue" }),
        new Rectangle({ pos: [100, 300], size: [400, 10], color: "blue" }),
        new Rectangle({ pos: [700, 300], size: [200, 10], color: "blue" }),
        new Box({ pos: [250, 520], size: [50, 80], color: "orange" }),
        new Box({ pos: [250, 230], size: [50, 70], color: "teal" }),
        new Box({ pos: [720, 700], size: [100, 100], color: "darkgreen" }),
        new Box({ pos: [400, 570], size: [50, 30], color: "purple" }),
        new Box({ pos: [550, 400], size: [50, 50], color: "darkblue" }),
    ],
});
