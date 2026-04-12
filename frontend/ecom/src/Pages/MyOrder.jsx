import React, { useEffect } from "react";
import { PageTitle } from "../Components/PageTitle";
import { Navbar } from "../Components/Navbar";
import { Box } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { myorders } from "../Redux/userSlicer";

export const MyOrder = () => {
  const { orders, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // ✅ Safe calculation (important)
  const totalAmount = orders?.reduce(
    (acc, ord) => acc + ord.totalPrice,
    0
  );

  useEffect(() => {
    if (user?._id) {
      dispatch(myorders(user._id));
    }
  }, [dispatch, user]);

  return (
    <div>
      <PageTitle title="Circuit-Store | MyOrder" />
      <Navbar />

      <div className="container">

        {/* Header */}
        <div className="text-center mt-4">
          <h2 className="d-flex align-items-center justify-content-center gap-2">
            <Box size={28} /> My Orders ({orders.length})
          </h2>
          <h5>Track and manage your purchases</h5>
        </div>

        {/* Summary */}
        <div className="bg-white p-3 rounded shadow d-flex justify-content-between mb-4 mt-4">
          <h5>Total Orders: {orders.length}</h5>
          <h5>Total Spent: ₹{totalAmount.toLocaleString()}</h5>
        </div>

        {/* Orders */}
        <div className="row g-4">
          {orders?.map((order) => (
            <div key={order._id} className="col-12 col-md-4">

              <div className="shadow rounded p-4 h-100 order-card">

                {/* Top Info */}
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-1">
                      <strong>Order ID:</strong>{" "}
                      #{order._id.slice(-5).toUpperCase()}
                    </p>
                    <small>
                      {new Date(order.createdAt).toDateString()}
                    </small>
                  </div>

                  <span
                    className={`badge px-3 py-2 ${
                      order.orderStatus === "Delivered"
                        ? "bg-success"
                        : order.orderStatus === "Cancelled"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items */}
                <div className="mt-3">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex gap-3 mb-3 align-items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        width={90}
                        height={90}
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />

                      <div>
                        <h6 className="mb-1">{item.name}</h6>
                        <p className="mb-0 fw-bold">
                          ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="d-flex justify-content-between align-items-center mt-3">

                  <div className="d-flex gap-2">
                    <button className="btn primary-btn btn-sm">
                      View Details
                    </button>

                    <button className="btn btn-outline-secondary btn-sm">
                      Track
                    </button>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    disabled={order.orderStatus === "Delivered"}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};