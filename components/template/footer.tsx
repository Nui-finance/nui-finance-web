import { Container, Flex } from '@chakra-ui/react';
import { Link } from 'components/molecule';

const Footer = () => {
  return (
    <Container
      as={Flex}
      justifyContent="center"
      maxW="container.page"
      px={{ base: '4', md: '8' }}
      gap="4"
      pt="4"
      pb={{ base: '24', md: '4' }}
      mt="200px"
    >
      <Link href="https://github.com/Nui-finance" fontWeight="medium">
        GitHub
      </Link>
    </Container>
  );
};

export default Footer;
