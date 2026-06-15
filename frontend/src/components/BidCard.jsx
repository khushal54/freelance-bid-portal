const BidCard = ({ bid, isOwner, projectStatus, onAccept }) => {
  return (
    <div className="card">
      <h3>{bid.bidder?.name}</h3>
      <p>Email: {bid.bidder?.email}</p>
      <p>College: {bid.bidder?.college}</p>
      <p>Skills: {bid.bidder?.skills}</p>

      <h4>Bid Amount: ₹{bid.amount}</h4>
      <p>{bid.message}</p>
      <p>Status: {bid.status}</p>

      {isOwner && projectStatus === "open" && (
        <button onClick={() => onAccept(bid._id)}>Accept Bid</button>
      )}
    </div>
  );
};

export default BidCard;