import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card, Table, Container, Row, Col } from "react-bootstrap";

function Notification() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/fetchOrder");
      const data = response.data;

      if (data.success) {
        setOrders(data.data);
      } else {
        console.log(data.description);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      let updatedStatus;

      switch (status) {
        case "pending":
          updatedStatus = "accepted";
          break;
        case "accepted":
          updatedStatus = "delivered";
          break;
        // case "on the way":
        //   updatedStatus = "delivered";
        //   break;
        case "denied":
          updatedStatus = "denied";
          break;
        default:
          console.error("Invalid order status");
          return;
      }

      const response = await axios.put(`/orders/${orderId}`, {
        status: updatedStatus,
      });
      const data = response.data;

      if (response.status === 200) {
        // Update the orders list with the updated order
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: updatedStatus } : order
          )
        );
        console.log("Order status updated successfully");
      } else {
        console.error("Failed to update order status:", data.error);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Orders</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Items</th>
                      <th className="border-0">Total price</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order._id}>
                        <td>{index + 1}</td>
                        <td>
                          {order.items &&
                            order.items.map((item) => (
                              <div key={item._id}>{item.name}</div>
                            ))}
                        </td>
                        <td>{order.totalPrice}</td>
                        <td>{order.status}</td>
                        <td>
                          {order.status === "pending" && (
                            <>
                              <Button
                                variant="success"
                                onClick={() =>
                                  updateOrderStatus(order._id, "accepted")
                                }
                              >
                                Accept
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() =>
                                  updateOrderStatus(order._id, "denied")
                                }
                              >
                                Deny
                              </Button>
                            </>
                          )}
                          {order.status === "accepted" && (
                            <>
                              <Button
                                variant="info"
                                onClick={() =>
                                  updateOrderStatus(order._id, "on the way")
                                }
                              >
                                On the Way
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() =>
                                  updateOrderStatus(order._id, "denied")
                                }
                              >
                                Deny
                              </Button>
                            </>
                          )}
                          {order.status === "on the way" && (
                            <Button
                              variant="primary"
                              onClick={() =>
                                updateOrderStatus(order._id, "delivered")
                              }
                            >
                              On the way
                            </Button>
                          )}
                          {order.status === "denied" && (
                            <Button variant="danger" disabled>
                              Denied
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Notification;
