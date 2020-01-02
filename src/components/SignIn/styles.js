import styled, { css } from "styled-components";
import { spacing } from "../../common/common.styles";
import { ReactComponent as EmailSvg } from "../../assets/img/email.svg";
import { ReactComponent as GoogleSvg } from "../../assets/img/google.svg";
import { ReactComponent as FacebookSvg } from "../../assets/img/facebook.svg";
import { ReactComponent as TwitterSvg } from "../../assets/img/twitter.svg";

const ButtonIcon = css`
  fill: white;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: ${spacing.l2};
`;

export const EmailIcon = styled(EmailSvg)`
  ${ButtonIcon};
`;

export const GoogleIcon = styled(GoogleSvg)`
  ${ButtonIcon};
`;

export const FacebookIcon = styled(FacebookSvg)`
  ${ButtonIcon};
`;

export const TwitterIcon = styled(TwitterSvg)`
  ${ButtonIcon};
`;
