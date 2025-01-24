import React from "react";
import {
  pickNotDeprecated,
  useActiveAuthProvider,
  useGetIdentity,
} from "@refinedev/core";
import { Layout as AntdLayout, Typography, Avatar, Space, theme, Col, Row } from "antd";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import AppLauncher from "../AppLauncher";
import Logo from "../Logo";

export const ThemedHeaderV2: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  isSticky,
  sticky,
}) => {
  const { token } = theme.useToken();

  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const shouldRenderHeader = user && (user.name || user.avatar);

  if (!shouldRenderHeader) {
    return null;
  }

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    color: token.colorBgBase,
    padding: "0px 12px",
    height: "48px",
    lineHeight: "48px",
  };

  if (pickNotDeprecated(sticky, isSticky)) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Row style={{height: '48px'}}>
        <Col span={18}>
          <Space size="middle">
            <AppLauncher></AppLauncher>
            <Logo></Logo>
            <div>AppName</div>
          </Space>
        </Col>
        <Col span={6}>
          <Space style={{float: 'right'}}>
            <Space size="middle">
              {user?.name && <Typography.Text strong style={{color: "inherit"}}>{user.name}</Typography.Text>}
              {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
            </Space>
          </Space>
        </Col>
      </Row>
    </AntdLayout.Header>
  );
};
