import { Modal, Tab, Tabs, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

function AuthModal({ show, handleClose }) {
  const { login } = useAuth();
  const [key, setKey] = useState("signin");

  const handleSignIn = (e) => {
    e.preventDefault();
    login(e.target.email.value);
    handleClose();
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    login(e.target.email.value);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Welcome</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          <Tab eventKey="signin" title="Sign In">
            <Form onSubmit={handleSignIn}>
              <Form.Control type="email" name="email" placeholder="Email" required className="mb-3" />
              <Form.Control type="password" name="password" placeholder="Password" required className="mb-3" />
              <Button type="submit" className="w-100">Sign In</Button>
            </Form>
          </Tab>
          <Tab eventKey="signup" title="Sign Up">
            <Form onSubmit={handleSignUp}>
              <Form.Control type="text" name="name" placeholder="Name" required className="mb-3" />
              <Form.Control type="email" name="email" placeholder="Email" required className="mb-3" />
              <Form.Control type="password" name="password" placeholder="Password" required className="mb-3" />
              <Button type="submit" variant="success" className="w-100">Sign Up</Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
