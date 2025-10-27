import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container text-center py-5">
          <div className="row">
            <div className="col-12">
              <h1 className="text-gradient">⚠️ حدث خطأ</h1>
              <p className="text-muted">عذراً، حدث خطأ غير متوقع.</p>
              <button 
                className="btn btn-gradient mt-3"
                onClick={() => window.location.reload()}
              >
                إعادة تحميل الصفحة
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;