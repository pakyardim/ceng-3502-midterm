const request = require("supertest");
const fs = require("fs");

const app = require("../server.js");

describe("Visited Landmarks", () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  });

  it("should return all visited landmarks", async () => {
    const response = await request(app).get("/api/visited").expect(200);

    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      return JSON.stringify([
        {
          id: 1,
          landmark_id: 1,
          visited_date: "2023-10-01",
          visitor_name: "John Doe",
        },
        {
          id: 2,
          landmark_id: 2,
          visited_date: "2023-10-02",
          visitor_name: "Jane Smith",
        },
      ]);
    });

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        landmark_id: expect.any(Number),
        visited_date: expect.any(String),
        visitor_name: expect.any(String),
      })
    );
  });

  it("should add a new visited landmark", async () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockImplementationOnce(() =>
        JSON.stringify([
          {
            id: 1,
            name: "Statue of Liberty",
            description:
              "A colossal neoclassical sculpture on Liberty Island in New York City.",
            location: {
              latitude: 40.6892,
              longitude: -74.0445,
            },
            category: "Monument",
          },
          {
            id: 2,
            name: "Great Wall of China",
            description:
              "A series of fortifications that stretch across northern China.",
            location: {
              latitude: 40.4319,
              longitude: 116.5704,
            },
            category: "Historical",
          },
        ])
      )
      .mockImplementationOnce(() => JSON.stringify([]));

    const newVisitedLandmark = {
      landmark_id: 2,
      visited_date: "2023-10-03",
      visitor_name: "Jane Doe",
    };

    const response = await request(app)
      .post("/api/visited")
      .send(newVisitedLandmark)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        landmark_id: newVisitedLandmark.landmark_id,
        visited_date: newVisitedLandmark.visited_date,
        visitor_name: newVisitedLandmark.visitor_name,
      })
    );
  });

  it("should return 404 for non-existent landmark", async () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockImplementationOnce(() =>
        JSON.stringify([
          {
            id: 1,
            name: "Statue of Liberty",
            description:
              "A colossal neoclassical sculpture on Liberty Island in New York City.",
            location: {
              latitude: 40.6892,
              longitude: -74.0445,
            },
            category: "Monument",
          },
        ])
      )
      .mockImplementationOnce(() => JSON.stringify([]));

    const newVisitedLandmark = {
      landmark_id: 999,
      visited_date: "2023-10-03",
      visitor_name: "Jane Doe",
    };

    const response = await request(app)
      .post("/api/visited")
      .send(newVisitedLandmark)
      .expect(404);

    expect(response.body).toEqual({
      error: "Landmark not found",
    });
  });

  it("should return visit history by landmark ID", async () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockImplementationOnce(() =>
        JSON.stringify([
          {
            id: 1,
            name: "Statue of Liberty",
            description:
              "A colossal neoclassical sculpture on Liberty Island in New York City.",
            location: {
              latitude: 40.6892,
              longitude: -74.0445,
            },
            category: "Monument",
          },
        ])
      )
      .mockImplementationOnce(() =>
        JSON.stringify([
          {
            id: 1,
            landmark_id: 1,
            visited_date: "2023-10-01",
            visitor_name: "John Doe",
          },
          {
            id: 2,
            landmark_id: 1,
            visited_date: "2023-10-02",
            visitor_name: "Jane Smith",
          },
        ])
      );

    const response = await request(app).get("/api/visited/1").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: 1,
        landmark_id: 1,
        visited_date: "2023-10-01",
        visitor_name: "John Doe",
      })
    );
  });

  it("should return 404 for non-existent landmark ID", async () => {
    const response = await request(app).get("/api/visited/999").expect(404);

    expect(response.body).toEqual({
      error: "Landmark not found",
    });
  });
});
