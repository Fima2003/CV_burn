import BaseLayout from './base-layout';
import type { DeviceLayoutProps } from './types';

export default function PhoneLayout(props: DeviceLayoutProps) {
  return <BaseLayout variant="phone" {...props} />;
}
