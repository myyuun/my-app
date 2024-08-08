import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const TicketPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ticketInfo, setTicketInfo] = useState({});
  const [tickets, setTickets] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userPoint, setUserPoint] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [floor, setFloor] = useState(1);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      if (id) {
        const fetchTicketData = async () => {
          try {
            const res = await fetch(`/api/ticketInfo?floor=${floor}`);
            if (!res.ok) {
              throw new Error("Failed to fetch ticket data");
            }
            const data = await res.json();
            setTicketInfo(data.ticketInfo);
            setTickets(data.tickets);
          } catch (error) {
            console.error("티켓 값을 불러오지 못했습니다:", error);
            setError("데이터를 불러오지 못했습니다");
            setTickets([]);
            setTicketInfo({});
          }
        };

        const fetchUserPoint = async () => {
          try {
            const res = await fetch("/api/user");
            if (!res.ok) {
              throw new Error("Failed to fetch user point");
            }
            const data = await res.json();
            setUserPoint(data.user_point);
          } catch (error) {
            console.error("포인트를 불러오지 못했습니다:", error);
            setError("데이터를 불러오지 못했습니다");
          }
        };

        fetchTicketData();
        fetchUserPoint();
      }
    },
    [id, floor]
  );

  useEffect(
    () => {
      const total = selectedSeats.reduce(
        (sum, ticket) => sum + ticket.ticket_price,
        0
      );
      setTotalPrice(total);
    },
    [selectedSeats]
  );

  const handleSeatSelect = ticket => {
    if (ticket.ticket_status) {
      alert("이미 예매된 좌석입니다.");
      return;
    }
    if (selectedSeats.includes(ticket)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== ticket));
    } else {
      if (selectedSeats.length >= 3) {
        setSelectedSeats([ticket]);
      } else {
        setSelectedSeats([...selectedSeats, ticket]);
      }
    }
  };

  const handleFloorChange = direction => {
    if (direction === "prev" && floor > 1) {
      setFloor(floor - 1);
    } else if (direction === "next" && floor < 2) {
      setFloor(floor + 1);
    }
  };

  const getSeatColor = grade => {
    switch (grade) {
      case "S":
        return "bg-red-500";
      case "A":
        return "bg-purple-500";
      case "B":
        return "bg-yellow-500";
      case "C":
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const remainingSeats = tickets.filter(ticket => ticket.ticket_status === 0)
    .length;
  const remainingSSeats = tickets.filter(
    ticket => ticket.ticket_status === 0 && ticket.ticket_grade === "S"
  ).length;
  const remainingASeats = tickets.filter(
    ticket => ticket.ticket_status === 0 && ticket.ticket_grade === "A"
  ).length;
  const remainingBSeats = tickets.filter(
    ticket => ticket.ticket_status === 0 && ticket.ticket_grade === "B"
  ).length;
  const remainingCSeats = tickets.filter(
    ticket => ticket.ticket_status === 0 && ticket.ticket_grade === "C"
  ).length;

  const handleCompleteSelection = () => {
    router.push("/payment");
  };

  const handleGoBack = () => {
    router.push("/previous");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h4 className="text-2xl font-bold text-center">
          {error}
        </h4>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 */}
      <div className="bg-blue-500 text-white p-4 mb-4">
        <h1 className="text-2xl font-bold text-left">좌석 선택</h1>
      </div>

      {/* 티켓 정보 섹션 */}
      <div className="bg-gray-200 p-4 mb-4 flex justify-between">
        <div className="text-3xl font-extrabold">
          {ticketInfo.ticket_name}
        </div>
        <div className="text-sm text-right">
          <div>
            {ticketInfo.ticket_date}
          </div>
          <div>
            {ticketInfo.ticket_time}
          </div>
          <div>
            {ticketInfo.ticket_place}
          </div>
        </div>
      </div>

      {/* 좌우 화살표 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleFloorChange("prev")}
          disabled={floor === 1}
        >
          <FaArrowLeft
            className={`text-3xl ${floor === 1
              ? "text-gray-300"
              : "text-blue-500"}`}
          />
        </button>
        <span className="text-xl font-bold">
          현재 층: {floor}층
        </span>
        <button
          onClick={() => handleFloorChange("next")}
          disabled={floor === 2}
        >
          <FaArrowRight
            className={`text-3xl ${floor === 2
              ? "text-gray-300"
              : "text-blue-500"}`}
          />
        </button>
      </div>

      {/* 좌석 목록 */}
      <div className="grid grid-cols-10 gap-2 mb-4">
        {tickets.map(ticket =>
          <div
            key={ticket.ticket_seat}
            className={`col-span-1 p-2 border cursor-pointer ${selectedSeats.includes(
              ticket
            )
              ? "border-4 border-black"
              : ""} ${ticket.ticket_status
              ? "bg-gray-400"
              : getSeatColor(ticket.ticket_grade)}`}
            onClick={() => handleSeatSelect(ticket)}
          >
            {ticket.ticket_row}-{ticket.ticket_column}
          </div>
        )}
      </div>

      {/* 남은 좌석 수 */}
      <div className="text-center mb-4">
        남은 좌석 : {remainingSeats}석<br />
        (S등급 : {remainingSSeats}석, A등급 : {remainingASeats}석, B등급 :{" "}
        {remainingBSeats}석, C등급 : {remainingCSeats}석)
      </div>

      {/* 선택된 좌석 목록 */}
      <div className="mt-20 flex justify-between items-start">
        <div className="w-1/2">
          <h2 className="text-xl mb-2 font-bold">고른 좌석</h2>
          <div className="border-t-2 border-b-2 border-black">
            {selectedSeats.map((ticket, index) =>
              <div
                key={ticket.ticket_seat}
                className={`border-b p-2 ${index !== selectedSeats.length - 1
                  ? "mb-4"
                  : ""}`}
              >
                {" "}{/* 마지막 티켓 외에는 mb-4 추가 */}
                <div className="flex">
                  <div className="w-1/3 p-2 bg-gray-200 flex items-center justify-center">
                    <div className="font-bold">좌석층수</div>
                  </div>
                  <div className="w-2/3 p-2 flex items-center">
                    <div>
                      {ticket.ticket_floor}층
                    </div>
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-300" />{" "}
                {/* 구분선 추가 및 마진 적용 */}
                <div className="flex mt-2">
                  <div className="w-1/3 p-2 bg-gray-200 flex items-center justify-center">
                    <div className="font-bold">좌석등급</div>
                  </div>
                  <div className="w-2/3 p-2 flex items-center">
                    <div>
                      {ticket.ticket_grade}
                    </div>
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-300" />{" "}
                {/* 구분선 추가 및 마진 적용 */}
                <div className="flex mt-2">
                  <div className="w-1/3 p-2 bg-gray-200 flex items-center justify-center">
                    <div className="font-bold">좌석위치</div>
                  </div>
                  <div className="w-2/3 p-2 flex items-center">
                    <div>
                      {ticket.ticket_row}-{ticket.ticket_column}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 버튼 2개 */}
        <div className="flex flex-col items-center justify-center w-1/2">
          <button
            onClick={handleCompleteSelection}
            className="mt-10 bg-orange-500 text-white p-4 font-bold text-xl rounded w-96"
          >
            <span className="animate-flash">좌석 선택 완료 및 결제</span>
          </button>
          <button
            onClick={handleGoBack}
            className="bg-gray-200 text-black mt-4 p-2 text-sm rounded w-96"
          >
            이전으로 돌아가기
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-bold">
          나의 포인트: {userPoint}원
        </p>
        <p className="font-bold">
          필요 포인트: {totalPrice}원
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
