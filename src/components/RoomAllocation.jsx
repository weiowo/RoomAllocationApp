import { useEffect, useState } from "react";
import CustomInputNumber from "./CustomInputNumber.jsx";
import styled from "styled-components";

const initialData = { adult: 1, child: 0 };

const RemainPeopleWrapper = styled.div`
  padding: 16px;
  border: 1px solid rgba(30, 159, 210, 0.16);
  border-radius: 4px;
  background-color: rgb(240, 253, 255);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RoomAllocationWrapper = styled.div`
  border: 2px dashed grey;
  padding: 18px 10px;
  width: 400px;
  margin: auto;
`;

const RoomBox = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: ${(props) =>
    props.$lastbox ? "none" : "1px solid lightgrey"};
  padding: ${(props) => (props.$lastbox ? "20px 0px 0px 0px" : "20px 0px")};
`;

const PeopleAmountRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 20px;
`;

const AdultChildBox = styled.div`
  padding-top: 3px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  & > span:nth-child(2) {
    color: grey;
  }
`;

function RoomAllocation({ guest, room, onChange }) {
  const initialResult = Array.from({ length: room }, () => ({
    ...initialData,
  }));

  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    onChange(result);
  }, [result, onChange]);

  const handleRoomInputChange = (index, type, newValue) => {
    setResult((prevResult) => {
      const updatedResult = [...prevResult];
      updatedResult[index][type] = newValue;
      return updatedResult;
    });
  };

  const totalPeople = result.reduce(
    (acc, room) => acc + room.adult + room.child,
    0
  );

  const remainedPeople = Math.max(guest - totalPeople, 0);

  return (
    <RoomAllocationWrapper>
      <Title>
        住客人數：{guest} 人 / {room} 房
      </Title>
      <RemainPeopleWrapper>
        尚未分配人數: {remainedPeople} 人
      </RemainPeopleWrapper>
      {result.length > 0 ? (
        result.map((roomDetail, i) => (
          <RoomBox key={i} $lastbox={i + 1 === result.length}>
            <Title>
              房間 : {Number(roomDetail.adult || 1) + Number(roomDetail.child)}{" "}
              人
            </Title>
            <PeopleAmountRow>
              <AdultChildBox>
                <span>大人</span>
                <span>年齡 20+</span>
              </AdultChildBox>
              <CustomInputNumber
                min={1}
                max={Math.min(
                  remainedPeople + roomDetail.adult,
                  4 - roomDetail.child
                )}
                step={1}
                name={`room${[i + 1]}-adult`}
                value={roomDetail.adult}
                disabled={room === guest}
                incrementButtonDisabled={totalPeople === guest}
                onChange={(newValue) =>
                  handleRoomInputChange(i, "adult", newValue)
                }
                onBlur={(event) => {
                  console.log(event.target.name, event.target.value);
                }}
              />
            </PeopleAmountRow>
            <hr />
            <PeopleAmountRow>
              <AdultChildBox>小孩</AdultChildBox>
              <CustomInputNumber
                min={0}
                max={Math.min(
                  remainedPeople + roomDetail.child,
                  4 - roomDetail.adult
                )}
                step={1}
                name={`room${[i + 1]}-child`}
                value={roomDetail.child}
                disabled={room === guest}
                incrementButtonDisabled={totalPeople === guest}
                onChange={(newValue) => {
                  handleRoomInputChange(i, "child", newValue);
                }}
                onBlur={(event) => {
                  console.log(event.target.name, event.target.value);
                }}
              />
            </PeopleAmountRow>
          </RoomBox>
        ))
      ) : (
        <div>No rooms available</div>
      )}
    </RoomAllocationWrapper>
  );
}

export default RoomAllocation;
