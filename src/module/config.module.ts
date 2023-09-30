import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import * as path from 'path';

const mqConfigurationFactory = () => ({
  RABBIT_MQ_URL: `amqp://${process.env.RABBIT_MQ_HOST}:${process.env.RABBIT_MQ_PORT}`,
});

const ENV_FILES_DIR = './config';

const SELECTED_ENV_FILE = path.join(
  ENV_FILES_DIR,
  `${process.env.NODE_ENV ?? ''}.env`,
);

const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [mqConfigurationFactory],
  envFilePath: SELECTED_ENV_FILE,
});

export default AppConfigModule;
