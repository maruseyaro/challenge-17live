export const data: StreamerResponse = [
  {
    userID: "4f4d5462-4a9f-483e-b620-9df9c13ec840",
    displayName: "Jone",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_525BEE6E-94B5-4C7F-AB47-1A6F9735EE82.jpg",
    score: 157000,
  },
  {
    userID: "2c0c5c67-1cfc-4b99-992e-2918b8a0dcc1",
    displayName: "Victoria",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_8390066D-46E4-4741-968D-9FF84B276B52.jpg",
    score: 46200,
  },
  {
    userID: "5100dedb-c2e5-48da-aeaf-83fa49a3482d",
    displayName: "Joy",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_CE9F51C5-7006-4DE6-9059-9AEA98F7DF13.jpg",
    score: 38800,
  },
  {
    userID: "9ece1a05-eb2d-403a-b179-ccbfc0ad9250",
    displayName: "Quinn",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_2A847B03-7BE8-4645-B62A-07201A90EDEF.jpg",
    score: 33400,
  },
  {
    userID: "32afdaac-a83b-481f-bc5a-1e85c3188c6f",
    displayName: "Sheenalo",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_95D163ED-6BF8-4D09-897C-B2E5320BE462.jpg",
    score: 31600,
  },
  {
    userID: "a2e0bdd3-0aa0-4fc4-91c2-b8ad00d26211",
    displayName: "Charlene",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_a943a748-16c8-4afa-87a6-8b6ac0e1f47a.jpg",
    score: 30800,
  },
  {
    userID: "47a35fbb-ce6b-4c82-9973-2a9391b6478d",
    displayName: "LeonaBaby",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_B850B9FF-E1FD-4DFA-8737-E67E32B71B8B.jpg",
    score: 22300,
  },
  {
    userID: "db8c493f-0a53-4b5f-8ffe-b0967e076e03",
    displayName: "Sunny",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_1A36F357-6EA2-4C77-B26F-588319F26EF2.jpg",
    score: 17800,
  },
  {
    userID: "44e1f164-831d-4732-8e49-0cda24369000",
    displayName: "ImWord",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_4f761f7d-0b85-45dd-90ad-1444c548abd6.jpg",
    score: 17300,
  },
  {
    userID: "416089f2-f66a-411a-b275-2151d86dcaeb",
    displayName: "Dophine",
    picture:
      "https://assets-17app.akamaized.net/THUMBNAIL_59946513-FC72-4444-8CC9-991BFFF19C22.jpg",
    score: 15400,
  },
];

export interface Streamer {
  userID: string;
  displayName: string;
  picture: string;
  score: number;
}

type StreamerResponse = Array<Streamer>;

// Scores of every streamer updated every second.
const INTERVAL = 1000;

// Total number of streamer so we can pick one at random
const STREAMER_COUNT = data.length;

const MIN_POINT_INCREMENT = 500;
const MAX_POINT_INCREMENT = 2000;

// Scores of every streamer updated every second.
// Because it's reasonable to assume only
// some streamers will actually have updates let's do it

export function subscribeToPointUpdates(
  onPointIncrementUpdate: OnPointIncrementUpdate
) {
  const id = window.setInterval(() => {
    // side effect!
    const randomIndices = doPickRandomIndices(STREAMER_COUNT);
    const randomUpdates: PointIncrementUpdate[] = [];

    randomIndices.forEach((rIndex) => {
      const randomStreamer = data[rIndex];

      // side effect!
      const pointIncrement = generateRandomPointIncrement();
      const update = {
        userID: randomStreamer.userID,
        pointIncrement,
      };

      randomUpdates.push(update);
    });

    onPointIncrementUpdate(randomUpdates);
  }, INTERVAL);

  return function unsubscribe() {
    window.clearInterval(id);
  };
}

type State = Array<Streamer>;

function generateRandomPointIncrement() {
  const pointIncrement = Math.ceil(
    Math.random() * (MAX_POINT_INCREMENT - MIN_POINT_INCREMENT) +
      MIN_POINT_INCREMENT
  );

  return pointIncrement;
}

function doPickRandomIndices(length: number) {
  const randomIndices = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * length);

    // avoid duplicates
    // length will be different every time: GOOD
    // indices will be different: GOOD
    // not every streamer will have updates every time
    if (randomIndices.indexOf(randomIndex) === -1) {
      randomIndices.push(randomIndex);
    }
  }

  return randomIndices;
}

export function updateWithPointIncrement(
  prevState: State,
  updates: PointIncrementUpdate[]
): State {
  const newState = [...prevState];

  updates.forEach((dataUpdate) => {
    const index = newState.findIndex((s) => s.userID === dataUpdate.userID);

    // local mutation
    newState[index] = {
      ...newState[index],
      score: newState[index].score + dataUpdate.pointIncrement,
    };
  });

  // local mutation
  newState.sort(sortByScoreDesc);

  return newState;
}

// TODO: add a lastUpdatedAt to disambiguate between same score?
function sortByScoreDesc(a: Streamer, b: Streamer): number {
  return b.score - a.score;
}

type OnPointIncrementUpdate = (update: PointIncrementUpdate[]) => void;

interface PointIncrementUpdate {
  userID: string;
  pointIncrement: number;
}
