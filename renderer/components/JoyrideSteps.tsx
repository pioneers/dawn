import { Placement } from 'react-joyride';

/*
 * Specifies the list of steps to follow in the joyride
 * (the interactive intro tour). Each object in the list is a step.
 */

interface JoyrideSteps {
  title: React.ReactNode;
  content: React.ReactNode;
  target: string | HTMLElement;
  placement: Placement;
  event: string;
}

export const joyrideSteps: JoyrideSteps[] = [
  {
    title: 'Header and Version',
    content:
      'This header displays the version of Dawn that you have. We may periodically release updates to Dawn, so always make sure you have the latest version.',
    target: '#header-title',
    placement: 'bottom',
    event: 'hover',
  },
  {
    title: 'Status Indicator',
    content:
      "This displays your connection status with the robot and (when connected) the robot's current battery level. Keep an eye on the battery level and charge the battery whenever it is nearly drained. Allowing the battery level to drop too low could damage your battery permanently.",
    target: '#battery-indicator',
    placement: 'bottom',
    event: 'hover',
  },
  {
    title: 'Editor',
    content:
      "This is the code editor. Create and edit your robot's code here. The editor has autocompletion. Press CTRL/CMD-SPACEBAR to see autocomplete suggestions.",
    target: '.ace_editor',
    placement: 'bottom-start',
    event: 'hover',
  },
  {
    title: 'File operations',
    content:
      "Use these buttons to create, open, save, and upload code files. You can additionally download the robot's version of your code.",
    target: '#file-operations-buttons',
    placement: 'bottom',
    event: 'hover',
  },
  {
    title: 'Code execution',
    content:
      'Use these buttons to run and stop your code, including a last-ditch Emergency-Stop. In addition to changing state, there is an option to simulate the autonomous and teleop timings of a real match.',
    target: '#code-execution-buttons',
    placement: 'bottom',
    event: 'hover',
  },
  {
    title: 'Output Console',
    content: 'Use these buttons to see and clear the console, along with changing its size and copying console text.',
    target: '#console-buttons',
    placement: 'bottom',
    event: 'hover',
  },
  {
    title: 'Editor Settings',
    content:
      "You can change the font size of the editor and change your editor's theme using these buttons. Your preferences will be saved automatically.",
    target: '#editor-settings-buttons',
    placement: 'bottom',
    event: 'hover',
  },
  {
    title: 'Peripherals',
    content:
      "This panel displays info about your robot's peripherals, including motors and sensors. You can click on a peripheral name to change it. The name you assign to a peripheral here is the same name you should use to reference the peripheral in your code.",
    target: '#peripherals-panel',
    placement: 'left',
    event: 'hover',
  },
  {
    title: 'Gamepads',
    content:
      'This panel displays all the connected gamepads. Once you have a gamepad connected, press the details buttons to see more gamepad details.',
    target: '#gamepads-panel',
    placement: 'left',
    event: 'hover',
  },
  {
    title: 'Updates',
    content:
      "Occasionally we may release updates to the robot's software. When this happens, you will download the update package and click on this button to upload it to the robot. Please do not restart your robot.",
    target: '#update-software-button',
    placement: 'left',
    event: 'hover',
  },
  {
    title: 'Robot IP',
    content: 'This sets the IP address Dawn will use when trying to connect to the robot.',
    target: '#update-address-button',
    placement: 'left',
    event: 'hover',
  },
];
