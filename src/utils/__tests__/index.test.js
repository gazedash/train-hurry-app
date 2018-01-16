import { createTimesFromArrival } from "../index";

describe("utils", () => {
  it("generates", () => {
    const f4 = [60, 45, 30, 15];
    const f3 = [45, 30, 15];
    const f2 = [30, 15];
    const f1 = [15];
    const f0 = [];
    const arrivalTimes = [
      [201, f4],
      [180, f4],
      [66, f4],
      [61, f4],
      [60, f4],
      [59, f3],
      [46, f3],
      [45, f3],
      [44, f2],
      [40, f2],
      [31, f2],
      [30, f2],
      [29, f1],
      [25, f1],
      [16, f1],
      [15, f1],
      [14, f0],
      [12, f0],
      [5, f0],
      [4, f0],
      [0, f0]
    ];

    arrivalTimes.map((time, i) => {
      expect(createTimesFromArrival(time[0])).toEqual(time[1]);
    });
  });
});
