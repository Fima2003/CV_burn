import BaseLayout from './base-layout';
import type { DeviceLayoutProps } from './types';

export default function ComputerLayout(props: DeviceLayoutProps) {
  return <BaseLayout variant="computer" {...props} />;
}
