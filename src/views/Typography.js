import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
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
    type: "",
    image: "",
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
    setFormData({
      id: "",
      type: "",
      image: "",
    });
  };

  const handleEdit = (articleId) => {
    
    setShowModal(true);
    // find
    const article = articles.find(
      
      (article) => article._id.toString() === articleId.toString()
    );
  
    setFormData({
      id: article._id,
      type: article.type,
      image: article.image,
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
      const formDataObject = new FormData();
      formDataObject.append("type", formData.type);
      formDataObject.append("image", formData.image);

      if (formData.id) {
        // Logic to update the article
        await axios.put(
          `/article/updateArticle/${formData.id}`,
          formDataObject
        );
        console.log("Article updated successfully");
      } else {
        // Logic to add a new article
        await axios.post("/article/addArticle", formDataObject, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Article added successfully");
      }

      handleCloseModal();
      fetchArticles();
    } catch (error) {
      console.error(error);
      console.log(
        "Error occurred while adding/updating article:",
        error.message
      );
    }
  };

  const deleteArticle = async (id) => {
    try {
      console.log(id);
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
                      <th className="border-0">Type</th>
                      <th className="border-0">Image</th>

                      <th className="border-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, index) => (
                      <tr key={article._id}>
                        <td>{index + 1}</td>
                        <td>{article.type}</td>
                        <td>
                          <img
                            src={`/uploads/${article.image}`}
                            alt="Image de l'article"
                            style={{ width: "100px" }}
                          />
                        </td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => handleEdit(article._id)}
                          >
                            Modifier
                          </Button>{" "}
                          <Button
                            variant="danger"
                            onClick={() => deleteArticle(article._id)}
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
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                disabled
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files[0];
                  setFormData({
                    ...formData,
                    image: file,
                  });
                }}
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
