import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginRolePrompt = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const role = query.get("role");     // "SELLER" or "ADMIN"
  const token = query.get("token");

  const handleChoice = (selectedRole) => {
    if (selectedRole === "CUSTOMER") {
      navigate(`/homepage?token=${token}`);
    } else if (selectedRole === "SELLER") {
      navigate(`/seller-dashboard?token=${token}`);
    } else if (selectedRole === "ADMIN") {
      navigate(`/admin-dashboard?token=${token}`);
    }
  };

  const renderOptions = () => {
    const buttons = [<button key="customer" onClick={() => handleChoice("CUSTOMER")}>Customer</button>];

    if (role === "SELLER") {
      buttons.push(<button key="seller" onClick={() => handleChoice("SELLER")}>Seller</button>);
    } else if (role === "ADMIN") {
      buttons.push(<button key="admin" onClick={() => handleChoice("ADMIN")}>Admin</button>);
    }

    return buttons;
  };

  return (
    <div>
      <h2>Select how you'd like to continue:</h2>
      {renderOptions()}
    </div>
  );
}

export default LoginRolePrompt