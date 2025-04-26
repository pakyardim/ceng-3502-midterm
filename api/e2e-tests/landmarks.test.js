const request = require("supertest");
const fs = require("fs");

const app = require("../server.js");

const mockLandmarks = [
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
    notes: "Visited in 2020",
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
    notes: "Visited in 2019",
  },
];

describe("Landmarks", () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  });

  it("should return all landmarks", async () => {
    jest
      .spyOn(fs, "readFileSync")
      .mockImplementationOnce(() => {
        return JSON.stringify(mockLandmarks);
      })
      .mockImplementationOnce(() => {
        return JSON.stringify([
          {
            id: 1,
            landmark_id: 1,
            visited_date: "2023-10-01",
            visitor_name: "John Doe",
          },
        ]);
      });

    const response = await request(app).get("/api/landmarks").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        location: {
          latitude: expect.any(Number),
          longitude: expect.any(Number),
        },
        category: expect.any(String),
        notes: expect.any(String),
        visited: expect.any(Boolean),
      })
    );
  });

  it("should add a new landmark", async () => {
    const newLandmark = {
      name: "Eiffel Tower",
      description:
        "A wrought-iron lattice tower on the Champ de Mars in Paris, France.",
      location: {
        latitude: 48.8584,
        longitude: 2.2945,
      },
      category: "Monument",
      notes: "Visited in 2021",
    };

    const response = await request(app)
      .post("/api/landmarks")
      .send(newLandmark)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newLandmark.name);
  });

  it("should return a landmark by ID", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return JSON.stringify(mockLandmarks);
    });

    const response = await request(app).get("/api/landmarks/1").expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: "Statue of Liberty",
        description:
          "A colossal neoclassical sculpture on Liberty Island in New York City.",
        location: {
          latitude: 40.6892,
          longitude: -74.0445,
        },
        category: "Monument",
        notes: "Visited in 2020",
      })
    );
  });

  it("should update a landmark", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return JSON.stringify(mockLandmarks);
    });

    const updatedLandmark = {
      name: "Tower of Pisa",
      description: "A freestanding bell tower, known for its unintended tilt.",
      location: {
        latitude: 43.7229,
        longitude: 10.3966,
      },
      category: "Monument",
      notes: "Visited in 2022",
    };

    const response = await request(app)
      .put("/api/landmarks/1")
      .send(updatedLandmark)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: 1,
        name: "Tower of Pisa",
        description:
          "A freestanding bell tower, known for its unintended tilt.",
        location: {
          latitude: 43.7229,
          longitude: 10.3966,
        },
        category: "Monument",
        notes: "Visited in 2022",
      })
    );
  });

  it("should delete a landmark", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return JSON.stringify(mockLandmarks);
    });
    const response = await request(app).delete("/api/landmarks/1").expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Landmark deleted successfully",
      })
    );
  });

  it("should return 404 for a non-existent landmark", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return JSON.stringify(mockLandmarks);
    });
    const response = await request(app).get("/api/landmarks/999").expect(404);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Landmark not found",
      })
    );
  });

  it("should return 400 for invalid landmark data", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementationOnce(() => {
      return JSON.stringify(mockLandmarks);
    });
    const invalidLandmark = {
      name: "Invalid Landmark",
      description: "This landmark has no location.",
      category: "Unknown",
    };

    const response = await request(app)
      .post("/api/landmarks")
      .send(invalidLandmark)
      .expect(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        error: "Invalid landmark data",
      })
    );
  });

  it("should return 500 for server errors", async () => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("Server error");
    });

    await request(app).get("/api/landmarks").expect(500);
  });
});
