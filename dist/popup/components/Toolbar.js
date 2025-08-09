import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Flex } from '@radix-ui/themes';
import { CopyButton } from '../../lib/ui';
const Toolbar = ({ prompt, improvedPrompt }) => {
    return (_jsxs(Flex, { gap: "2", justify: "center", children: [_jsx(CopyButton, { text: prompt, disabled: !prompt.trim(), label: "Copy Original" }), _jsx(CopyButton, { text: improvedPrompt, disabled: !improvedPrompt.trim(), label: "Copy Improved" })] }));
};
export default Toolbar;
