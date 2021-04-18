import { Spinner } from 'react-bootstrap';

const DefaultLoader = ({
  animation = 'border',
  className = '',
  size = 'sm',
  ...others
}) => {
  return (
    <Spinner
      {...others}
      animation={animation}
      size={size}
      className={className}
    />
  );
};

export default DefaultLoader;
