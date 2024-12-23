import clc from 'cli-color';
import {
  LogTypes,
  LogMutedTypes,
  LogInfoTypes,
  LogSuccessTypes,
  LogWarningTypes,
  LogFatalTypes,
} from '@/types';

export const Timestamp = () => new Date().toLocaleString().replace(',', '');

const Muted: LogMutedTypes = (label, message) => {
  console.log(
    `${clc.black(Timestamp())} ${clc.white(label)} ${clc.black(message)}`,
  );
};

const Info: LogInfoTypes = (label, message) => {
  console.log(
    `${clc.black(Timestamp())} ${clc.blue(label)} ${clc.white(message)}`,
  );
};

const Success: LogSuccessTypes = (label, message) => {
  console.log(
    `${clc.black(Timestamp())} ${clc.green(label)} ${clc.white(message)}`,
  );
};

const Warning: LogWarningTypes = (label, message) => {
  console.log(
    `${clc.black(Timestamp())} ${clc.yellow(label)} ${clc.white(message)}`,
  );
};

const Fatal: LogFatalTypes = (label, message) => {
  console.error(
    `${clc.black(Timestamp())} ${clc.red(label)} ${clc.white(message)}`,
  );
};

export const Log: LogTypes = {
  Muted,
  Success,
  Info,
  Warning,
  Fatal,
};
