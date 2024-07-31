import { Transform } from 'class-transformer';

export function TransformToBoolean(): PropertyDecorator {
  return Transform((param) => {
    if (param.value === 1 || param.value === true || param.value === 'true') {
      return true;
    } else if (
      param.value === 0 ||
      param.value === false ||
      param.value === 'false'
    ) {
      return false;
    }
    return param.value;
  });
}
