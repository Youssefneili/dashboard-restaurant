import React, { useState, useEffect } from "react";
import axios from "axios";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";

function Typography() {
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "",
    price: "",
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get("/article/fetchArticle");
      const data = response.data;

      if (data.success) {
        setArticles(data.data);
      } else {
        console.log(data.description);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = () => {
    setShowModal(true);
    // Réinitialisez le formulaire si nécessaire
    setFormData({
      id: "",
      name: "",
      type: "",
      price: "",
    });
  };

  const handleEdit = (articleId) => {
    setShowModal(true);
    // Obtenez les détails de l'article à modifier en fonction de l'ID
    const article = articles.find((article) => article._id === articleId);

    // Remplissez le formulaire avec les détails de l'article
    setFormData({
      id: article._id,
      name: article.name,
      type: article.type,
      price: article.price,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (formData.id) {
        // Logique de mise à jour de l'article
        await axios.put(`/article/updateArticle/${formData.id}`, formData);
      } else {
        // Logique d'ajout d'un nouvel article
        await axios.post("/article/addArticle", formData);
      }

      handleCloseModal();
      fetchArticles();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`/article/deleteArticle/${id}`);
      fetchArticles();
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
                <Card.Title as="h4">Articles</Card.Title>
                <Button variant="success" onClick={handleAdd}>
                  Ajouter
                </Button>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Price</th>
                      <th className="border-0">Type</th>
                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, index) => (
                      <tr key={article._id}>
                        <td>{index + 1}</td>
                        <td>{article.name}</td>
                        <td>{article.price}Dt</td>
                        <td>{article.type}</td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handleEdit(article._id)}
                          >
                            Modifier
                          </Button>{" "}
                          <Button
                            variant="danger"
                            onClick={() => deleteArticle(article.id)}
                          >
                            Supprimer
                          </Button>
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

      {/* Modal pour ajouter/modifier un article */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "Modifier" : "Ajouter"} un article
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {formData.id ? "Modifier" : "Ajouter"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Typography;
