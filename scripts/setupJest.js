import { configure as configureTranslation } from '@superset-ui/translation';
import { configure as configureEnzyme } from 'enzyme';
import EnzymeReactAdapter from 'enzyme-adapter-react-16';

configureTranslation();
configureEnzyme({ adapter: new EnzymeReactAdapter() });
