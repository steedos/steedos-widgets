import React, { useMemo } from "react";
import { ThemedLayoutContextProvider } from "@refinedev/antd";
import { ThemedHeaderV2 as DefaultHeader } from "./header";
import { ThemedSiderV2 as DefaultSider } from "./sider";
import { Grid, Layout as AntdLayout, ConfigProvider } from "antd";
import type { RefineThemedLayoutV2Props } from "@refinedev/antd";
import zhCN from 'antd/locale/zh_CN';

export const ThemedLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
}) => {
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  return (
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorBgElevated: '#002C5F'
      },
      components: {
        Avatar: {
          groupBorderColor: '#ffffff'
        },
        Layout: {
          bodyBg: 'background: radial-gradient(circle at 64% 46%, #e9f0f5 0, #f2f0f4 57%, #f5f5f5 100%);'
        },
        Menu: {
          activeBarBorderWidth: 0
        }
      }
    }}>
      <AntdLayout style={{ minHeight: "100vh" }}>
        <HeaderToRender />
        <AntdLayout>
          <AntdLayout.Sider width="auto" style={{background: "transparent"}} theme="light">
            <SiderToRender Title={Title} />
          </AntdLayout.Sider>
          <AntdLayout.Content>
            {children}
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
        </AntdLayout>
        {Footer && <Footer />}
      </AntdLayout>
    </ConfigProvider>
  );
};
