#!/usr/bin/env node

// include node fs module
const fs = require('fs');
const prompt = require('prompt');

const { writeFile, mkdir } = fs;

const properties = [
    {
        name: 'name',
        validator: /^[a-zA-Z\s]+$/,
        message: 'Enter new Component name',
        error: 'Component name must only be letters'
    },
    {
        name: 'filepath',
        message: 'Enter filepath to provision (default \'./\')'
    }
];

 
const makeComponentBoilerPlayer = async () => {
    prompt.get(properties, async (err, result) => {
        if (err) { return onErr(err); }

        console.log('result: ', result);
        
        const { name = 'Component', filepath = './' } = result;

        const directoryName = `${filepath}${name}`
        await mkdir(directoryName, (data) => console.log('data: ', data));
        const componentFileName = `${filepath}${name}/${name}.tsx`;

        const componentBoilerplate = `
import React from 'react';
import StyledComponents from './${name}Styled';
const {
    Container,
} = StyledComponents;
const ${name} = () => {
    return (
        <Container />
    );
};

export default ${name};
`;
        
        await writeFile(componentFileName, componentBoilerplate, (data) => console.log('data: ', data));

        const stylesFileName = `${filepath}${name}/${name}Styled.tsx`;

        const stylesBoilerplate = `
import styled from 'styled-components/native';
const Container = styled.View\`\`;
const StyledComponents = {
    Container,
};

export default StyledComponents;
`;

        await writeFile(stylesFileName, stylesBoilerplate, (data) => console.log('data: ', data));

        const storybookFileName = `${filepath}${name}/${name}.stories.tsx`;

        const storiesBoilerplate = `
import React from 'react';
import ${name} from './${name}';
import { storiesOf } from '@storybook/react-native';
storiesOf('${name}', module)
.add('default', () => (
    <${name} />
));
`;
        
    await writeFile(storybookFileName, storiesBoilerplate, (data) => console.log('data: ', data));
    });

};

prompt.start()

const onErr = (err) => {
    console.log(err);
    return 1;
}

makeComponentBoilerPlayer();