import { Fragment } from 'react';
import { Button } from 'react-bootstrap';
import DefaultLoader from './loader.component';

const DefaultButton = ({
  title,
  onClick,
  type = 'button',
  className = '',
  loading,
  variant = 'primary',
  ...others
}) => {
  return (
    <Button
      {...others}
      variant={variant}
      onClick={onClick}
      type={type}
      required={true}
      className={className}
    >
      {loading ? (
        <Fragment>
          <DefaultLoader /> Loading
        </Fragment>
      ) : (
        title
      )}
    </Button>
  );
};

export default DefaultButton;
