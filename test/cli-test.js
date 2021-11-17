import assert from 'assert';
import fs, { existsSync, promises, write } from 'fs';
import InstaComponent from '../cli.js';

const {
    createComponentDirectory,
    createStylesFile,
    createComponentFile,
    createStorybookFile,
    createTestsFile,
    writeBoilerplate,
} = InstaComponent;

describe('Create Component Directory', () => {
    afterEach(async () => {
        await fs.rmdir('./test/tmp-test', () => null);
    })

    it('should create a directory with the name provided in filepath provided', async () => {
        await createComponentDirectory({ componentName: 'tmp-test', filepath: './test/' });
        assert.ok(fs.existsSync('./test/tmp-test'));
    });
}); 

describe('Create Component File', () => {
    before(async () => {
        await promises.mkdir('./test/TestComponent');
    });

    after(async () => {
        await promises.rmdir('./test/TestComponent/');
    });


    it('should create a react web component with styled-components and tsx filetype', async () => {
        await createComponentFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: false, 
            styledComponents: true
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.tsx');
        assert.ok(exists);

        const file = await promises.readFile('./test/TestComponent/TestComponent.tsx', 'utf-8');
        assert.ok(file.includes("import StyledComponents from './TestComponentStyled';"));
        assert.ok(file.includes("<Container />"));

        await promises.rm('./test/TestComponent/TestComponent.tsx');
    });

    it('should create a react web component with no styled-components and tsx filetype', async () => {
        await createComponentFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: false, 
            styledComponents: false
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.tsx');
        assert.ok(exists);

        const file = await promises.readFile('./test/TestComponent/TestComponent.tsx', 'utf-8');
        assert.ok(file.includes("<div />"));

        await promises.rm('./test/TestComponent/TestComponent.tsx');
    });

    it('should create a react-native component with styled-components', async () => {
        await createComponentFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: true, 
            styledComponents: true
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.tsx');
        assert.ok(exists);

        const file = await promises.readFile('./test/TestComponent/TestComponent.tsx', 'utf-8');
        assert.ok(file.includes("import StyledComponents from './TestComponentStyled';"));
        assert.ok(file.includes("<Container />"));

        await promises.rm('./test/TestComponent/TestComponent.tsx');
    });

    it('should create a react-native component with no styled-components', async () => {
        await createComponentFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: true, 
            styledComponents: false
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.tsx');
        assert.ok(exists);

        const file = await promises.readFile('./test/TestComponent/TestComponent.tsx', 'utf-8');
        assert.ok(file.includes("import { View } from 'react-native';"));
        assert.ok(file.includes("<View />"));

        await promises.rm('./test/TestComponent/TestComponent.tsx');
    });
}); 

describe('Create Styles File', () => {
    before(async () => {
        await promises.mkdir('./test/TestComponent');
    });

    after(async () => {
        await promises.rmdir('./test/TestComponent/');
    });


    it('should create a react web styles file with tsx filetype', async () => {
        const result = await createStylesFile({ componentName: 'TestComponent', filepath: './test/', typescript: true, native: false });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponentStyled.tsx');
        assert.ok(exists);
        const file = await promises.readFile('./test/TestComponent/TestComponentStyled.tsx', 'utf-8', () => null);
        assert.ok(file.includes("import styled from 'styled-components';"));
        assert.ok(file.includes("styled.div``"));

        await promises.rm('./test/TestComponent/TestComponentStyled.tsx');
    });

    it('should create a react web styles file with jsx filetype', async () => {
        const result = await createStylesFile({ componentName: 'TestComponent', filepath: './test/', typescript: false, native: false });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponentStyled.jsx');
        assert.ok(exists);
        const file = await promises.readFile('./test/TestComponent/TestComponentStyled.jsx', 'utf-8', () => null);

        assert.ok(file.includes("import styled from 'styled-components';"));
        assert.ok(file.includes("styled.div``"));

        await promises.rm('./test/TestComponent/TestComponentStyled.jsx');
    });

    it('should create a react native styles file with tsx filetype', async () => {
        const result = await createStylesFile({ componentName: 'TestComponent', filepath: './test/', typescript: true, native: true });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponentStyled.tsx');

        assert.ok(exists);
        const file = await promises.readFile('./test/TestComponent/TestComponentStyled.tsx', 'utf-8', () => null);

        assert.ok(file.includes("import styled from 'styled-components/native';"));
        assert.ok(file.includes("styled.View``"));

        await promises.rm('./test/TestComponent/TestComponentStyled.tsx');
    });

    it('should create a react-native styles file with jsx filetype', async () => {
        const result = await createStylesFile({ componentName: 'TestComponent', filepath: './test/', typescript: false, native: true });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponentStyled.jsx');

        assert.ok(exists);
        const file = await promises.readFile('./test/TestComponent/TestComponentStyled.jsx', 'utf-8', () => null);

        assert.ok(file.includes("import styled from 'styled-components/native';"));
        assert.ok(file.includes("styled.View``"));

        await promises.rm('./test/TestComponent/TestComponentStyled.jsx');
    });
}); 

describe('Create Storybook File', () => {
    before(async () => {
        await promises.mkdir('./test/TestComponent');
    });

    after(async () => {
        await promises.rmdir('./test/TestComponent/');
    });


    it('should create a jsx file', async () => {
        await createStorybookFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: false, 
            native: false, 
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.stories.jsx');
        assert.ok(exists);
        await promises.rm('./test/TestComponent/TestComponent.stories.jsx');
    });

    it('should create a storybook file for react-web', async () => {
        await createStorybookFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: false, 
        });

        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.stories.tsx');
        assert.ok(exists);

        const file = await promises.readFile('./test/TestComponent/TestComponent.stories.tsx', 'utf-8');
        assert.ok(file.includes("const Template : Story<ComponentProps <typeof TestComponent>> = (args) => <TestComponent {...args} />;"));

        await promises.rm('./test/TestComponent/TestComponent.stories.tsx');
    });

    it('should create a storybook file for react-native', async () => {
        await createStorybookFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: true, 
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/TestComponent.stories.tsx');
        assert.ok(exists);

        const file = await promises.readFile('./test/TestComponent/TestComponent.stories.tsx', 'utf-8');
        assert.ok(file.includes("import { storiesOf } from '@storybook/react-native';"));

        await promises.rm('./test/TestComponent/TestComponent.stories.tsx');
    });
}); 

describe('Create a test File', () => {
    before(async () => {
        await promises.mkdir('./test/TestComponent');
    });

    after(async () => {
        await promises.rmdir('./test/TestComponent/');
    });


    it('should create a test file with jsx', async () => {
        await createTestsFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: false, 
        });
        // file exists
        const exists = await fs.existsSync('./test/TestComponent/__tests__/TestComponent.test.jsx');
        assert.ok(exists);
        await promises.rm('./test/TestComponent/__tests__/TestComponent.test.jsx');
        await promises.rmdir('./test/TestComponent/__tests__/');
    });

    it('should create a test file with tsx', async () => {
        await createTestsFile({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
        });

        // file exists
        const exists = await fs.existsSync('./test/TestComponent/__tests__/TestComponent.test.tsx');
        assert.ok(exists);
        await promises.rm('./test/TestComponent/__tests__/TestComponent.test.tsx');
        await promises.rmdir('./test/TestComponent/__tests__/');
    });
}); 

describe('Write all the boilerplate', () => {
    it('should create all the boilerplate', async () => {
        await writeBoilerplate({ 
            componentName: 'TestComponent', 
            filepath: './test/', 
            typescript: true, 
            native: true,
            styledComponents: true,
            storybook: true,
            tests: true,
        });
        // directory exists
        const componentDirectoryExists = await fs.existsSync('./test/TestComponent/');
        console.log('componentDirectoryExists', componentDirectoryExists);
        assert.ok(componentDirectoryExists);
        const componentFileExists = await fs.existsSync('./test/TestComponent/TestComponent.tsx');
        console.log('componentFileExists', componentFileExists);
        assert.ok(componentFileExists);
        const stylesExist = await fs.existsSync('./test/TestComponent/TestComponentStyled.tsx');
        console.log('stylesExist', stylesExist);
        assert.ok(stylesExist);
        const storiesExist = await fs.existsSync('./test/TestComponent/TestComponent.stories.tsx');
        console.log('storiesExist', storiesExist);
        assert.ok(storiesExist);
        const testsExist = await fs.existsSync('./test/TestComponent/__tests__/TestComponent.test.tsx');
        console.log('testsExist', testsExist);
        assert.ok(testsExist);


        //clean up
        await promises.rm('./test/TestComponent/TestComponent.tsx');
        await promises.rm('./test/TestComponent/TestComponentStyled.tsx');
        await promises.rm('./test/TestComponent/TestComponent.stories.tsx');
        await promises.rm('./test/TestComponent/__tests__/TestComponent.test.tsx');
        await promises.rmdir('./test/TestComponent/__tests__/');
        await promises.rmdir('./test/TestComponent/');
    });
});