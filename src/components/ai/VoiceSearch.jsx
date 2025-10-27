import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaMicrophone, FaSearch, FaStop } from 'react-icons/fa';

const VoiceSearch = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('المتصفح لا يدعم التعرف على الصوت');
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'ar-SA';

    speechRecognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    speechRecognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      if (onSearch) onSearch(text);
    };

    speechRecognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    speechRecognition.start();
    setRecognition(speechRecognition);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="voice-search"
    >
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="ابحث صوتياً..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch(transcript)}
        />
        
        <Button
          variant={isListening ? 'danger' : 'outline-primary'}
          onClick={isListening ? stopListening : startListening}
          className="d-flex align-items-center gap-2"
        >
          {isListening ? (
            <>
              <FaStop />
              <span>إيقاف</span>
            </>
          ) : (
            <>
              <FaMicrophone />
              <span>تحدث</span>
            </>
          )}
        </Button>
        
        <Button
          variant="primary"
          onClick={() => onSearch(transcript)}
          disabled={!transcript.trim()}
        >
          <FaSearch />
        </Button>
      </InputGroup>

      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="listening-indicator mt-2 text-center"
        >
          <div className="pulse-animation"></div>
          <small className="text-muted">استمع إليك... تحدث الآن</small>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoiceSearch;