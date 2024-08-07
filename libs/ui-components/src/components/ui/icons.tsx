import {
  CaretSortIcon,
  ChatBubbleIcon,
  CheckCircledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Component1Icon,
  ComponentInstanceIcon,
  CookieIcon,
  CopyIcon,
  CounterClockwiseClockIcon,
  Cross1Icon,
  Cross2Icon,
  CubeIcon,
  DotsHorizontalIcon,
  EnterFullScreenIcon,
  ExclamationTriangleIcon,
  ExitIcon,
  FontItalicIcon,
  GearIcon,
  HamburgerMenuIcon,
  HomeIcon,
  InfoCircledIcon,
  LapTimerIcon,
  LightningBoltIcon,
  MagicWandIcon,
  PauseIcon,
  Pencil2Icon,
  PlayIcon,
  PlusIcon,
  QuestionMarkCircledIcon,
  QuestionMarkIcon,
  ReaderIcon,
  RocketIcon,
  Share2Icon,
  StarFilledIcon,
  StopIcon,
  TrashIcon,
  UpdateIcon,
  ZoomInIcon,
} from '@radix-ui/react-icons'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../../utils'

const iconVariants = cva('', {
  variants: {
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-7 w-7',
      lg: 'h-14 w-14',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export interface IconProps extends React.HTMLAttributes<SVGSVGElement>, React.RefAttributes<SVGSVGElement>, VariantProps<typeof iconVariants> {
  children?: undefined
}
const defaultProps = ({ size, className, ...props }: IconProps): IconProps => ({ ...props, className: cn(iconVariants({ size, className })) })

interface RadixIconProps extends React.HTMLAttributes<SVGSVGElement>, React.RefAttributes<SVGSVGElement>, VariantProps<typeof iconVariants> {
  children?: undefined
}
const defaultRadixProps = ({ size, className, ...props }: RadixIconProps): RadixIconProps => ({
  ...props,
  className: cn(iconVariants({ size, className })),
})

export const Icons = {
  Cookies: (props: RadixIconProps) => <CookieIcon {...defaultRadixProps(props)} />,
  Magic: (props: RadixIconProps) => <MagicWandIcon {...defaultRadixProps(props)} />,
  Chat: (props: RadixIconProps) => <ChatBubbleIcon {...defaultRadixProps(props)} />,
  Rocket: (props: RadixIconProps) => <RocketIcon {...defaultRadixProps(props)} />,
  Info: (props: RadixIconProps) => <InfoCircledIcon {...defaultRadixProps(props)} />,
  FullScreen: (props: RadixIconProps) => <EnterFullScreenIcon {...defaultRadixProps(props)} />,
  Stop: (props: RadixIconProps) => <StopIcon {...defaultRadixProps(props)} />,
  ZoomIn: (props: RadixIconProps) => <ZoomInIcon {...defaultRadixProps(props)} />,
  Pause: (props: RadixIconProps) => <PauseIcon {...defaultRadixProps(props)} />,
  Timeout: (props: RadixIconProps) => <LapTimerIcon {...defaultRadixProps(props)} />,
  Power: (props: RadixIconProps) => <LightningBoltIcon {...defaultRadixProps(props)} />,
  Version: (props: RadixIconProps) => <CounterClockwiseClockIcon {...defaultRadixProps(props)} />,
  Publish: (props: RadixIconProps) => <Share2Icon {...defaultRadixProps(props)} />,
  Run: (props: RadixIconProps) => <PlayIcon {...defaultRadixProps(props)} />,
  Test: (props: RadixIconProps) => <MagicWandIcon {...defaultRadixProps(props)} />,
  Change: (props: RadixIconProps) => <UpdateIcon {...defaultRadixProps(props)} />,
  Update: (props: RadixIconProps) => <UpdateIcon {...defaultRadixProps(props)} />,
  QuestionMarkCircle: (props: RadixIconProps) => <QuestionMarkCircledIcon {...defaultRadixProps(props)} />,
  QuestionMark: (props: RadixIconProps) => <QuestionMarkIcon {...defaultRadixProps(props)} />,
  Check: (props: RadixIconProps) => <CheckIcon {...defaultRadixProps(props)} />,
  Delete: (props: RadixIconProps) => <TrashIcon {...defaultRadixProps(props)} />,
  Warn: (props: RadixIconProps) => <ExclamationTriangleIcon {...defaultRadixProps(props)} />,
  Valid: (props: RadixIconProps) => <CheckCircledIcon {...defaultRadixProps(props)} />,
  True: (props: RadixIconProps) => <CheckIcon {...defaultRadixProps(props)} />,
  False: (props: RadixIconProps) => <Cross2Icon {...defaultRadixProps(props)} />,
  // true: (props: RadixIconsProps) => <CheckCircledIcon {...defaultRadixProps(props)} />,
  // false: (props: RadixIconsProps) => <CrossCircledIcon {...defaultRadixProps(props)} />,
  More: (props: RadixIconProps) => <DotsHorizontalIcon {...defaultRadixProps(props)} />,
  Rewards: (props: RadixIconProps) => <StarFilledIcon {...defaultRadixProps(props)} />,
  Home: (props: RadixIconProps) => <HomeIcon {...defaultRadixProps(props)} />,
  Edit: (props: RadixIconProps) => <Pencil2Icon {...defaultRadixProps(props)} />,
  Typing: (props: RadixIconProps) => <FontItalicIcon {...defaultRadixProps(props)} />,
  Settings: (props: RadixIconProps) => <GearIcon {...defaultRadixProps(props)} />,
  Copy: (props: RadixIconProps) => <CopyIcon {...defaultRadixProps(props)} />,
  HamburgerMenu: (props: RadixIconProps) => <HamburgerMenuIcon {...defaultRadixProps(props)} />,
  Strategy: (props: RadixIconProps) => <Component1Icon {...defaultRadixProps(props)} />,
  Condition: (props: RadixIconProps) => <ComponentInstanceIcon {...defaultRadixProps(props)} />,
  Exchange: (props: RadixIconProps) => <CubeIcon {...defaultRadixProps(props)} />,
  Exit: (props: RadixIconProps) => <ExitIcon {...defaultRadixProps(props)} />,
  Article: (props: RadixIconProps) => <ReaderIcon {...defaultRadixProps(props)} />,
  Plus: (props: RadixIconProps) => <PlusIcon {...defaultRadixProps(props)} />,
  ArrowLeft: (props: RadixIconProps) => <ChevronLeftIcon {...defaultRadixProps(props)} />,
  ArrowRight: (props: RadixIconProps) => <ChevronRightIcon {...defaultRadixProps(props)} />,
  ArrowDown: (props: RadixIconProps) => <ChevronDownIcon {...defaultRadixProps(props)} />,
  ArrowUp: (props: RadixIconProps) => <ChevronUpIcon {...defaultRadixProps(props)} />,
  Close: (props: RadixIconProps) => <Cross1Icon {...defaultRadixProps(props)} />,
  Sort: (props: RadixIconProps) => <CaretSortIcon {...defaultRadixProps(props)} />,
  Logo: (props: IconProps) => (
    <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...defaultProps(props)}>
      <path
        d="M17.6293 16.355H23.5793V25.56C23.3226 25.63 22.9493 25.7 22.4593 25.77C21.9926 25.84 21.4793 25.875 20.9193 25.875C19.776 25.875 18.936 25.6767 18.3993 25.28C17.886 24.8833 17.6293 24.1483 17.6293 23.075V16.355ZM23.5793 19.47H17.6293V8.83C17.886 8.76 18.2476 8.69 18.7143 8.62C19.2043 8.55 19.7293 8.515 20.2893 8.515C21.456 8.515 22.296 8.71333 22.8093 9.11C23.3226 9.48333 23.5793 10.2183 23.5793 11.315V19.47Z"
        fill="#7C3BED"
      />
      <path
        d="M0 10.125H6.125V25.385L3.255 25.7C2.25167 25.7 1.45833 25.4083 0.875 24.825C0.291667 24.2417 0 23.4483 0 22.445V10.125ZM3.255 25.7V20.765H14.14C14.3033 21.0217 14.455 21.36 14.595 21.78C14.735 22.2 14.805 22.655 14.805 23.145C14.805 24.0083 14.6183 24.65 14.245 25.07C13.8717 25.49 13.3583 25.7 12.705 25.7H3.255ZM6.125 18.21H0V4.315C0.28 4.26833 0.688333 4.21 1.225 4.14C1.785 4.04667 2.32167 4 2.835 4C4.00167 4 4.84167 4.19833 5.355 4.595C5.86833 4.99167 6.125 5.76167 6.125 6.905V18.21Z"
        fill="#7C3BED"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 3.5C24 5.433 22.433 7 20.5 7C18.567 7 17 5.433 17 3.5C17 1.567 18.567 0 20.5 0C22.433 0 24 1.567 24 3.5ZM23 3C23 3.50745 22.622 3.5045 22.1322 3.50068H22.1322C22.0889 3.50034 22.0448 3.5 22 3.5C21.9552 3.5 21.9111 3.50034 21.8678 3.50068H21.8678C21.378 3.5045 21 3.50745 21 3C21 2.44772 21.4477 2 22 2C22.5523 2 23 2.44772 23 3ZM19.1322 3.50068C19.622 3.5045 20 3.50745 20 3C20 2.44772 19.5523 2 19 2C18.4477 2 18 2.44772 18 3C18 3.50745 18.378 3.5045 18.8678 3.50068C18.911 3.50034 18.9552 3.5 19 3.5C19.0448 3.5 19.089 3.50034 19.1322 3.50068Z"
        fill="#7C3BED"
      />
    </svg>
  ),
  LogoWhole: (props: IconProps) => (
    <svg width="132" height="32" viewBox="0 0 132 32" style={{ color: '#7C3BED' }} xmlns="http://www.w3.org/2000/svg" {...defaultProps(props)}>
      <path
        d="M117.715 20.4454C117.364 19.6502 116.99 18.738 116.593 17.709C116.195 16.6565 115.774 15.4053 115.33 13.9552C114.909 12.4818 114.441 10.7043 113.926 8.62275C114.254 8.29532 114.686 8.01466 115.224 7.78078C115.786 7.52352 116.394 7.39488 117.049 7.39488C117.867 7.39488 118.545 7.57029 119.083 7.92111C119.621 8.24854 120.019 8.88002 120.276 9.81553C120.744 11.4527 121.212 13.0782 121.679 14.6919C122.147 16.2823 122.603 17.8727 123.048 19.4631H123.188C123.562 18.3872 123.925 17.2061 124.276 15.9198C124.65 14.6334 124.989 13.3237 125.293 11.9906C125.62 10.6341 125.889 9.32439 126.1 8.06144C126.497 7.85095 126.907 7.68723 127.328 7.57029C127.749 7.45335 128.193 7.39488 128.661 7.39488C129.479 7.39488 130.193 7.57029 130.801 7.92111C131.409 8.27193 131.713 8.88002 131.713 9.74537C131.713 10.4938 131.619 11.3591 131.432 12.3414C131.245 13.3237 130.988 14.3645 130.66 15.4637C130.333 16.563 129.959 17.6739 129.538 18.7965C129.117 19.8957 128.672 20.9599 128.205 21.989C127.737 22.9946 127.269 23.9068 126.801 24.7253C125.492 26.994 124.276 28.6779 123.153 29.7771C122.03 30.8764 120.896 31.426 119.75 31.426C118.814 31.426 118.031 31.1336 117.399 30.5489C116.768 29.9642 116.394 29.2041 116.277 28.2686C116.768 27.8476 117.259 27.3916 117.75 26.9004C118.265 26.4093 118.756 25.883 119.224 25.3217C119.692 24.7838 120.112 24.2459 120.487 23.708C120.089 23.591 119.656 23.3221 119.189 22.9011C118.744 22.4567 118.253 21.6381 117.715 20.4454Z"
        fill="currentColor"
      />
      <path
        d="M106.041 12.7624V16.7618H100.078V11.8503C100.078 11.1721 100.253 10.5874 100.604 10.0962C100.978 9.58168 101.457 9.13731 102.042 8.7631C102.861 8.27195 103.82 7.89774 104.919 7.64048C106.018 7.38321 107.152 7.25458 108.322 7.25458C110.871 7.25458 112.146 8.15501 112.146 9.95588C112.146 10.3769 112.087 10.7745 111.97 11.1487C111.853 11.4995 111.713 11.8035 111.549 12.0608C111.315 12.014 111.035 11.9789 110.707 11.9556C110.38 11.9322 110.017 11.9205 109.62 11.9205C109.035 11.9205 108.415 11.9906 107.76 12.131C107.106 12.2713 106.533 12.4818 106.041 12.7624ZM100.078 15.5339H106.041V24.7604C105.784 24.8306 105.41 24.9008 104.919 24.9709C104.451 25.0411 103.937 25.0762 103.375 25.0762C102.229 25.0762 101.387 24.8774 100.849 24.4798C100.335 24.0822 100.078 23.3455 100.078 22.2696V15.5339Z"
        fill="currentColor"
      />
      <path
        d="M91.9607 12.7624V16.7618H85.9968V11.8503C85.9968 11.1721 86.1722 10.5874 86.523 10.0962C86.8972 9.58168 87.3767 9.13731 87.9614 8.7631C88.78 8.27195 89.7389 7.89774 90.8381 7.64048C91.9373 7.38321 93.0717 7.25458 94.2411 7.25458C96.7904 7.25458 98.065 8.15501 98.065 9.95588C98.065 10.3769 98.0065 10.7745 97.8896 11.1487C97.7726 11.4995 97.6323 11.8035 97.4686 12.0608C97.2347 12.014 96.9541 11.9789 96.6266 11.9556C96.2992 11.9322 95.9367 11.9205 95.5391 11.9205C94.9544 11.9205 94.3346 11.9906 93.6798 12.131C93.0249 12.2713 92.4519 12.4818 91.9607 12.7624ZM85.9968 15.5339H91.9607V24.7604C91.7035 24.8306 91.3293 24.9008 90.8381 24.9709C90.3704 25.0411 89.8558 25.0762 89.2945 25.0762C88.1485 25.0762 87.3065 24.8774 86.7686 24.4798C86.2541 24.0822 85.9968 23.3455 85.9968 22.2696V15.5339Z"
        fill="currentColor"
      />
      <path
        d="M69.6196 18.9369L69.4091 15.0077L77.513 13.6746C77.4663 13.2068 77.2324 12.7391 76.8114 12.2713C76.3904 11.8035 75.7355 11.5697 74.8468 11.5697C73.9113 11.5697 73.1278 11.8737 72.4963 12.4818C71.8882 13.0899 71.5608 13.9552 71.514 15.0778L71.7245 18.0247C71.9584 19.1006 72.4846 19.849 73.3032 20.27C74.1452 20.691 75.0807 20.9014 76.1098 20.9014C77.092 20.9014 78.0276 20.7728 78.9163 20.5155C79.805 20.2583 80.5184 19.9776 81.0563 19.6736C81.4305 19.9075 81.7462 20.2349 82.0035 20.6559C82.2608 21.0769 82.3894 21.5212 82.3894 21.989C82.3894 22.7608 82.0971 23.404 81.5124 23.9185C80.9511 24.4096 80.1676 24.7721 79.1619 25.006C78.1562 25.2399 76.9985 25.3568 75.6888 25.3568C73.8645 25.3568 72.2157 25.0177 70.7422 24.3395C69.2922 23.6378 68.1345 22.5971 67.2691 21.2172C66.4271 19.8373 66.0062 18.1066 66.0062 16.0251C66.0062 14.4815 66.2517 13.1483 66.7429 12.0257C67.2574 10.9031 67.9357 9.99097 68.7776 9.28933C69.6196 8.58769 70.5551 8.07316 71.5842 7.74573C72.6366 7.39491 73.7125 7.2195 74.8117 7.2195C76.4723 7.2195 77.9223 7.54693 79.1619 8.20179C80.4014 8.83327 81.372 9.71031 82.0737 10.8329C82.7753 11.9322 83.1261 13.2068 83.1261 14.6569C83.1261 15.4521 82.9039 16.0601 82.4596 16.4811C82.0152 16.9021 81.3954 17.1711 80.6002 17.288L69.6196 18.9369Z"
        fill="currentColor"
      />
      <path
        d="M56.562 18.2703L52.2118 15.569L60.1053 7.50014C61.3214 7.50014 62.292 7.76911 63.0171 8.30703C63.7655 8.84495 64.1397 9.5232 64.1397 10.3418C64.1397 11.0434 63.8941 11.6632 63.403 12.2011C62.9118 12.739 62.1517 13.4524 61.1226 14.3411L56.562 18.2703ZM52.4925 16.411L57.2987 14.3411L64.701 21.7083C64.6074 22.7842 64.2917 23.6261 63.7538 24.2342C63.2159 24.8189 62.4441 25.1113 61.4384 25.1113C60.7133 25.1113 60.0468 24.9359 59.4387 24.585C58.854 24.2108 58.2225 23.591 57.5443 22.7257L52.4925 16.411ZM48.1072 15.5339H54.0712V24.7604C53.8139 24.8306 53.4397 24.9008 52.9486 24.9709C52.4808 25.0411 51.9663 25.0762 51.4049 25.0762C50.2589 25.0762 49.417 24.8774 48.879 24.4798C48.3645 24.0822 48.1072 23.3455 48.1072 22.2696V15.5339ZM54.0712 18.6562H48.1072V1.92212C48.3645 1.85196 48.727 1.78179 49.1948 1.71163C49.6859 1.64147 50.2122 1.60638 50.7735 1.60638C51.9429 1.60638 52.7848 1.80518 53.2994 2.20278C53.8139 2.57698 54.0712 3.3137 54.0712 4.41294V18.6562Z"
        fill="currentColor"
      />
      <path
        d="M44.3532 13.8149V17.0424H38.3893V13.9903C38.3893 13.2653 38.1671 12.7391 37.7227 12.4116C37.3018 12.0608 36.7404 11.8854 36.0388 11.8854C35.571 11.8854 35.1267 11.9439 34.7057 12.0608C34.3081 12.1777 33.9222 12.3298 33.548 12.5169V17.0424H27.5841V11.71C27.5841 11.0785 27.7127 10.564 27.97 10.1664C28.2506 9.76878 28.6248 9.40627 29.0926 9.07884C29.8878 8.51753 30.8935 8.07316 32.1096 7.74573C33.3258 7.39491 34.6589 7.2195 36.109 7.2195C38.7518 7.2195 40.7866 7.8042 42.2132 8.97359C43.6399 10.1196 44.3532 11.7334 44.3532 13.8149ZM27.5841 15.5339H33.548V24.7605C33.2907 24.8306 32.9165 24.9008 32.4254 24.9709C31.9576 25.0411 31.4431 25.0762 30.8818 25.0762C29.7358 25.0762 28.8938 24.8774 28.3559 24.4798C27.8413 24.0822 27.5841 23.3455 27.5841 22.2696V15.5339ZM38.3893 15.5339H44.3532V24.7605C44.0959 24.8306 43.7217 24.9008 43.2306 24.9709C42.7628 25.0411 42.2483 25.0762 41.687 25.0762C40.541 25.0762 39.699 24.8774 39.1611 24.4798C38.6466 24.0822 38.3893 23.3455 38.3893 22.2696V15.5339Z"
        fill="currentColor"
      />
      <path
        d="M17.8234 15.5339H23.7873V24.7604C23.53 24.8306 23.1558 24.9008 22.6647 24.9709C22.1969 25.0411 21.6824 25.0762 21.1211 25.0762C19.975 25.0762 19.1331 24.8774 18.5952 24.4798C18.0806 24.0822 17.8234 23.3455 17.8234 22.2696V15.5339ZM23.7873 18.6562H17.8234V7.99127C18.0806 7.92111 18.4431 7.85095 18.9109 7.78078C19.402 7.71062 19.9283 7.67554 20.4896 7.67554C21.659 7.67554 22.5009 7.87434 23.0155 8.27193C23.53 8.64614 23.7873 9.38286 23.7873 10.4821V18.6562Z"
        fill="currentColor"
      />
      <path
        d="M0.152771 9.28933H6.2921V24.585L3.41539 24.9008C2.40971 24.9008 1.61452 24.6084 1.02982 24.0237C0.44512 23.439 0.152771 22.6438 0.152771 21.6382V9.28933ZM3.41539 24.9008V19.9542H14.3259C14.4896 20.2115 14.6416 20.5506 14.7819 20.9716C14.9223 21.3926 14.9924 21.8486 14.9924 22.3398C14.9924 23.2051 14.8053 23.8483 14.4311 24.2693C14.0569 24.6903 13.5424 24.9008 12.8875 24.9008H3.41539ZM6.2921 17.3932H0.152771V3.46573C0.433426 3.41896 0.842715 3.36049 1.38064 3.29032C1.94195 3.19677 2.47987 3.14999 2.99441 3.14999C4.1638 3.14999 5.00577 3.34879 5.5203 3.74639C6.03484 4.14398 6.2921 4.91578 6.2921 6.06179V17.3932Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 3.11137C24 4.82974 22.607 6.22275 20.8886 6.22275C19.1703 6.22275 17.7773 4.82974 17.7773 3.11137C17.7773 1.39301 19.1703 0 20.8886 0C22.607 0 24 1.39301 24 3.11137ZM23.111 2.66689C23.111 3.11799 22.775 3.11537 22.3396 3.11197C22.3012 3.11167 22.2619 3.11137 22.2221 3.11137C22.1822 3.11137 22.143 3.11167 22.1045 3.11197C21.6691 3.11537 21.3331 3.11799 21.3331 2.66689C21.3331 2.17592 21.7311 1.77792 22.2221 1.77792C22.713 1.77792 23.111 2.17592 23.111 2.66689ZM19.6727 3.11197C20.1081 3.11537 20.4441 3.11799 20.4441 2.66689C20.4441 2.17592 20.0461 1.77792 19.5552 1.77792C19.0642 1.77792 18.6662 2.17592 18.6662 2.66689C18.6662 3.11799 19.0022 3.11537 19.4376 3.11197C19.4761 3.11167 19.5153 3.11137 19.5552 3.11137C19.595 3.11137 19.6343 3.11167 19.6727 3.11197Z"
        fill="currentColor"
      />
    </svg>
  ),
  twitter: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...defaultProps(props)}>
      <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148a13.98 13.98 0 0 0 10.15 5.144 4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" />
    </svg>
  ),
  gitHub: (props: IconProps) => (
    <svg viewBox="0 0 438.549 438.549" {...defaultProps(props)}>
      <path
        fill="currentColor"
        d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
      ></path>
    </svg>
  ),
  radix: (props: IconProps) => (
    <svg viewBox="0 0 25 25" fill="none" {...defaultProps(props)}>
      <path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z" fill="currentcolor"></path>
      <path d="M12 0H4V8H12V0Z" fill="currentcolor"></path>
      <path
        d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"
        fill="currentcolor"
      ></path>
    </svg>
  ),
  aria: (props: IconProps) => (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...defaultProps(props)}>
      <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
    </svg>
  ),
  npm: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
        fill="currentColor"
      />
    </svg>
  ),
  yarn: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z"
        fill="currentColor"
      />
    </svg>
  ),
  pnpm: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z"
        fill="currentColor"
      />
    </svg>
  ),
  react: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
        fill="currentColor"
      />
    </svg>
  ),
  tailwind: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"
        fill="currentColor"
      />
    </svg>
  ),
  google: (props: IconProps) => (
    <svg role="img" viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
  apple: (props: IconProps) => (
    <svg role="img" viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        fill="currentColor"
      />
    </svg>
  ),
  paypal: (props: IconProps) => (
    <svg role="img" viewBox="0 0 24 24" {...defaultProps(props)}>
      <path
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"
        fill="currentColor"
      />
    </svg>
  ),
  Spinner: ({ className, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps({ ...props, className: cn('animate-spin', className) })}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Upgarde: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
      <path d="M11 12h10" />
      <path d="M11 16h7" />
      <path d="M11 20h4" />
    </svg>
  ),
  BankCard: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      {...defaultProps(props)}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <path d="M2 10h20" />
    </svg>
  ),
  Analytics: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      {...defaultProps(props)}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  BadgeCheck: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Editor: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 8h.01" />
      <path d="M10 8h.01" />
      <path d="M14 8h.01" />
    </svg>
  ),
  Webhook: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
      <path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" />
      <path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" />
    </svg>
  ),
  Connectors: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <circle cx="12" cy="4.5" r="2.5" />
      <path d="m10.2 6.3-3.9 3.9" />
      <circle cx="4.5" cy="12" r="2.5" />
      <path d="M7 12h10" />
      <circle cx="19.5" cy="12" r="2.5" />
      <path d="m13.8 17.7 3.9-3.9" />
      <circle cx="12" cy="19.5" r="2.5" />
    </svg>
  ),
  RoadMap: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M8 6h10" />
      <path d="M6 12h9" />
      <path d="M11 18h7" />
    </svg>
  ),
  Partnership: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </svg>
  ),
  Feature: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  ),
  AI: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M12 13h4" />
      <path d="M12 18h6a2 2 0 0 1 2 2v1" />
      <path d="M12 8h8" />
      <path d="M16 8V5a2 2 0 0 1 2-2" />
      <circle cx="16" cy="13" r=".5" />
      <circle cx="18" cy="3" r=".5" />
      <circle cx="20" cy="21" r=".5" />
      <circle cx="20" cy="8" r=".5" />
    </svg>
  ),
  Invest: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M9 5v4" />
      <rect width="4" height="6" x="7" y="9" rx="1" />
      <path d="M9 15v2" />
      <path d="M17 3v2" />
      <rect width="4" height="8" x="15" y="5" rx="1" />
      <path d="M17 13v3" />
      <path d="M3 3v18h18" />
    </svg>
  ),
  DisplayCheck: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="m9 10 2 2 4-4" />
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  ),
  List: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M14 4h7" />
      <path d="M14 9h7" />
      <path d="M14 15h7" />
      <path d="M14 20h7" />
    </svg>
  ),
  Search: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  Hide: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Show: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ),
  Robot: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...defaultProps(props)}
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  ),
}
