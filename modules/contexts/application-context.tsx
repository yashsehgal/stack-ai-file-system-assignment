import { createContext } from 'react';
import { INITIAL_APPLICATION_CONTEXT_DATA } from '../constants/main';
import { ApplicationContextType } from '../interfaces/application-context-type';

export const ApplicationContext = createContext<ApplicationContextType>(INITIAL_APPLICATION_CONTEXT_DATA);
