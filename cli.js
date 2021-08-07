// include node fs module
import fs, { promises } from 'fs';
import prompt from 'prompt';

const { writeFile, mkdir } = fs;

const coreProperties = [
    {
        name: 'componentName',
        validator: /^[a-zA-Z\s]+$/,
        description: 'Enter new Component name (default "Component")',
        error: 'Component name must only be letters'
    },
    {
        name: 'filepath',
        description: 'Enter filepath to provision (default \'./\')'
    },
];

const extraProperties = [
    {
        name: 'native',
        description: 'Is it a React Native component? (t/f)',
        message: 'Input must be one of: (true|t|false|f)',
        type: 'boolean',
    },
    {
        name: 'typescript',
        description: 'Using typescript? (t/f)',
        message: 'Input must be one of: (true|t|false|f)',
        type: 'boolean',
    },
    {
        name: 'storybook',
        description: 'Add storybook? (t/f)',
        message: 'Input must be one of: (true|t|false|f)',
        type: 'boolean',
    },
    {
        name: 'styledComponents',
        description: 'Add styled components? (t/f)',
        message: 'Input must be one of: (true|t|false|f)',
        type: 'boolean',
    },
    {
        name: 'tests',
        description: 'Add tests? (t/f)',
        message: 'Input must be one of: (true|t|false|f)',
        type: 'boolean'
    }
];

export const createComponentDirectory = async ({ componentName, filepath }) => {
    const directoryName = `${filepath}${componentName}`;
    await promises.mkdir(directoryName);
};

export const createComponentFile = async ({ componentName, filepath, native, typescript, styledComponents }) => {
    const componentFileName = `${filepath}${componentName}/${componentName}.${typescript ? 'tsx' : 'jsx'}`;

    const styledComponentsImportChunk = `import StyledComponents from './${componentName}Styled';`;
    const nativeImportChunk = `import { View } from 'react-native';`
    
    const styledComponentsDestructuringChunk = `
const {
    Container,
} = StyledComponents;
`;

    const componentBoilerplate = `
import React from 'react';
${styledComponents ? styledComponentsImportChunk : native ? nativeImportChunk : ''}
${styledComponents ? styledComponentsDestructuringChunk : ''}

const ${componentName} = () => {
    return (
        <${styledComponents ? 'Container' : native ? 'View' : 'div'} />
    );
};

export default ${componentName};
`;

    await promises.writeFile(componentFileName, componentBoilerplate);
};

export const createStylesFile = async ({ componentName, filepath, typescript, native }) => {
    const stylesFileName = `${filepath}${componentName}/${componentName}Styled.${typescript ? 'tsx' : 'jsx'}`;

    const stylesBoilerplate = `
import styled from 'styled-components${native ? '/native' : ''}';

const Container = styled.${native ? 'View' : 'div'}\`\`;

const StyledComponents = {
    Container,
};

export default StyledComponents;
`;

    await promises.writeFile(stylesFileName, stylesBoilerplate);
};

export const createStorybookFile = async ({ componentName, filepath, native, typescript }) => {
    const storybookFileName = `${filepath}${componentName}/${componentName}.stories.${typescript ? 'tsx' : 'jsx'}`;

    const storiesNativeBoilerplate = `
import React from 'react';
import ${componentName} from './${componentName}';
import { storiesOf } from '@storybook/react-native';

storiesOf('${componentName}', module).add('default', () => (
    <${componentName} />
));
`;

    const storiesWebBoilerplate = `
import React from 'react';
import ${componentName} from './${componentName}';

export default {
  title: '${componentName}',
  component: ${componentName},
  argTypes: {},
};

const Template = (args) => <${componentName} {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
};
`;

    await promises.writeFile(storybookFileName, native ? storiesNativeBoilerplate : storiesWebBoilerplate);
}

export const createTestsFile = async ({ componentName, filepath, typescript }) => {
    const testsDirectoryName = `${filepath}${componentName}/__tests__/`;
    await promises.mkdir(testsDirectoryName);
    
    const testFileName = `${filepath}${componentName}/__tests__/${componentName}.test.${typescript ? 'tsx' : 'jsx'}`;

    const testBoilerplate = `
import React from 'react';
import renderer from 'react-test-renderer';
import ${componentName} from '../${componentName}';

test('renders correctly', () => {
    const tree = renderer.create(<${componentName} />).toJSON();
    expect(tree).toMatchSnapshot();
});
`;
    await promises.writeFile(testFileName, testBoilerplate); 
};
 
export const main = async () => {
    prompt.start();
    const configExists = await fs.existsSync('./insta-component.config.js');
    prompt.get(coreProperties, async (err, coreResult) => {
        if (err) { return onErr(err); }
        const { componentName, filepath } = coreResult;

        // if not config object prompt needed
        if(!configExists) {
            prompt.get(extraProperties, async (err, extraResult) => {
                if (err) { return onErr(err); }
                await writeConfigFile(extraResult);
                const args = { componentName, filepath, ...extraResult}
                await writeBoilerplate(args);
            });
        } else {
            const { default: config } = await import('./insta-component.config.js')
            const args = { componentName, filepath, ...config };
            await writeBoilerplate(args);
        }
    });
};

export const writeBoilerplate = async (args) => {
    const { 
        componentName = 'Component', 
        filepath = './',
        native = false,
        typescript = false,
        storybook = false,
        styledComponents = false,
        tests = false,
    } = args;

    
    await createComponentDirectory({ componentName, filepath });
    await createComponentFile({ componentName, filepath, native, typescript, styledComponents});
    
    if(styledComponents) await createStylesFile({ componentName, filepath, typescript, native});
    if(storybook) await createStorybookFile({ componentName, filepath, typescript, native });
    if(tests) await createTestsFile({ componentName, filepath, typescript});
};


// When there is no config file and CLI is used for the first time to create boilerplate
export const writeConfigFile = async ({ native, typescript, styledComponents, storybook, tests }) => {
    

    const configFileBoilerplate = `
const config = {
    native: ${native},
    typescript: ${typescript},
    storybook: ${storybook},
    styledComponents: ${styledComponents},
    tests: ${tests},
};

export default config;
`
    await promises.writeFile('./insta-component.config.js', configFileBoilerplate);
}

const onErr = (err) => {
    console.log(err);
    return 1;
};

export default {
    createComponentDirectory,
    createComponentFile,
    createStorybookFile,
    createStylesFile,
    createTestsFile,
    writeBoilerplate,
    writeConfigFile,
    main,
};