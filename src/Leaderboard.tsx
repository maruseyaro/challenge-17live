import { useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import Score from "./LeadboardScore";
import { type Streamer } from "./api";

export default function Leaderboard({ streamers }: Props) {
  const userIDs = streamers.map((s) => s.userID);
  const prevUserIDsRef = useRef(userIDs);

  useLayoutEffect(() => {
    // gather which index changes
    const diffs: number[] = [];

    userIDs.forEach((userID, index) => {
      const prevIndex = prevUserIDsRef.current.findIndex(
        (prevUserID) => prevUserID === userID
      );
      diffs.push(prevIndex - index);
    });

    // TODO: use dynamic refs?
    document.querySelectorAll("[data-leaderboard-row]").forEach((el, i) => {
      const diff = diffs[i];
      // we leverage the fact that rows have a fixed height
      const translateY = ROW_HEIGHT * diff;

      const keyframes = [
        {
          transform: `translate3d(0, ${translateY}px, 0)`,
        },
        lastAnimationKeyframe,
      ];

      el.animate(keyframes, animationOptions);
    });

    prevUserIDsRef.current = userIDs;
  }, [userIDs]);

  return (
    <ol>
      {streamers.map((streamer, index) => (
        <Row key={streamer.userID} data-leaderboard-row={index}>
          <RowLeft>
            <Position>{index + 1}</Position>
            <Avatar
              width={32}
              height={32}
              src={streamer.picture}
              loading="lazy"
              decoding="async"
            />
            {streamer.displayName}
          </RowLeft>

          <Score value={streamer.score} />
        </Row>
      ))}
    </ol>
  );
}

const animationOptions = {
  duration: 300,
  easing: "ease-in",
};

const lastAnimationKeyframe = { transform: `translate3d(0, 0, 0)` };

const ROW_HEIGHT = 48;

// avoid weird animation from single digits to double digits
const Position = styled.span`
  width: 1em;
  text-align: right;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${ROW_HEIGHT}px;
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: "flex-start";
`;

const Avatar = styled.img`
  border-radius: 50%;
  margin: 0 6px 0 8px;
`;

interface Props {
  streamers: Array<Streamer>;
}
