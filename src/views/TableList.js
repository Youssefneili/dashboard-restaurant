import React, { useState, useEffect } from "react";
import axios from "axios";
// react-bootstrap components
import { Card, Table, Container, Row, Col } from "react-bootstrap";

function TableList() {
  const [product, setProduct] = useState([]);
  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get("/product/fetchProduct");
      const data = response.data;

      if (data.success) {
        setProduct(data.data);
      } else {
        console.log(data.description);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Striped Table with Hover</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">garnitures</th>
                      <th className="border-0">images</th>
                      <th className="border-0">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.map((product, index) => (
                      <tr key={product._id}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.garnitures}</td>
                        <td>
                          <img
                            src={`/uploads/${product.image}`}
                            alt={product.name}
                            style={{ width: "100px", height: "auto" }}
                          />
                        </td>
                        <td>{product.price}</td>
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

export default TableList;
