import BaseLayout from './base-layout';
import type { DeviceLayoutProps } from './types';

export default function TabletLayout(props: DeviceLayoutProps) {
  return <BaseLayout variant="tablet" {...props} />;
}
