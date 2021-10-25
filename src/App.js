import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  Epic, 
  View, 
  Root, 
  Tabbar, 
  ModalRoot, 
  TabbarItem, 
  ConfigProvider,
  AdaptivityProvider, 
  AppRoot,
  platform,
  VKCOM,
  Cell,
  SplitCol,
  PanelHeader,
  SplitLayout,
  Panel,
  Group,
  Div
} from "@vkontakte/vkui";
import { 
  Icon28HomeOutline, 
  Icon28Profile,
  Icon28ComputerOutline,
  Icon28Users3Outline
} from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Persik from './panels/Persik';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [popout, setPopout] = useState(null);
	const [platformData, setData] = useState({isDesktop: false, hasHeader: true})
	const [Platform, setPlatform] = useState(platform());

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		let parsedUrl = new URL(window.location.href)
    	if (parsedUrl.searchParams.get('vk_platform') === 'desktop_web') {
      		setData({isDesktop: true, hasHeader: false});
      		setPlatform(VKCOM);

    	}
    	if (parsedUrl.searchParams.get('vk_platform') === null) {
      		setData({isDesktop: true, hasHeader: false});
      		setPlatform(VKCOM);
    	}
    console.log(platformData)
    //console.log(Platform)
	}, []);



	const go = to => () => {
		setActivePanel(to);
	};

	return (
		<ConfigProvider platform={Platform} isWebView={true}>
        <AdaptivityProvider>
          <AppRoot>
            <SplitLayout
              header={platformData.hasHeader && <PanelHeader separator={false} />}
              style={{ justifyContent: "center" }}
            >
              <SplitCol
                animate={!platformData.isDesktop}
                spaced={platformData.isDesktop}
                width={platformData.isDesktop ? '560px' : '100%'}
                maxWidth={platformData.isDesktop ? '560px' : '100%'}
              >   
                <Epic activeStory={activePanel} tabbar={ !platformData.isDesktop && 
                <Tabbar>
                  <TabbarItem
                    onClick={go('home')}
                    text='Главная'
                  ><Icon28ComputerOutline/></TabbarItem>
                  <TabbarItem
                    onClick={go('persik')}
                    text='Подробнее'
                  ><Icon28Users3Outline/></TabbarItem>
                </Tabbar>}>
                  <View id="home" activePanel="home" popout={popout}>
          <Home id='home' go={go}/>
          </View>
          <View id="persik" activePanel="persik" popout={popout}>
          <Persik id='persik' go={go}/>
          </View>
                </Epic>
              </SplitCol>

              {platformData.isDesktop && (
                <Div>
                <SplitCol fixed width='280px' maxWidth='280px'>
                  <Panel id='menuDesktop'>
                    {platformData.hasHeader && <PanelHeader/>}
                    <Group>
                      <Cell
                        onClick={go('home')}
                        disabled={activePanel === 'home'}
                        before={<Icon28ComputerOutline/>}
                        style={activePanel === 'home' ? {
                          backgroundColor: 'var(--button_secondary_background)',
                          borderRadius: 8
                        } : {}}
                      >
                        Главная
                      </Cell>
                      <Cell
                        onClick={go('persik')}
                        disabled={activePanel === 'persik'}
                        before={<Icon28Users3Outline/>}
                        style={activePanel === 'persik' ? {
                          backgroundColor: 'var(--button_secondary_background)',
                          borderRadius: 8
                        } : {}}
                      >
                        Подробнее
                      </Cell>
                    </Group>
                  </Panel>
                </SplitCol>
                </Div>
              )}
              
            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
	);
}

export default App;
