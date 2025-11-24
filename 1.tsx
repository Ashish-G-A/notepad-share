import { Grid, Loading, Page, Section, Type } from '@barclays/blueprint-react';
import Header from './header/header.component';
import { PhasesWithStages } from './phase/phases-wrapper.component';
import { useApplicationData } from './context';
import { useEffect, useState } from 'react';
import { ErrorPage } from './error-page/error.component';
import { PhaseType } from './phase/phase.type';
import { useApiRequest } from './hooks/process-api-request';
import Sidebar from './sidebar';
import { Banner } from './banner/banner.component';
import { isCancelCase } from '../../utils/cta/cancel-case-cta';
import { CancelCaseWithPopUpModel } from './cancel-case/cancel-case.component';
import useAppTrackingHook from './hooks/useAppTracking/Hook';
import { EMPTY_STRING, NULL, STATUS, UND_STATUS, EMPTY_ARRAY } from './utils/common.utils';

const PageLayout = () => {
  const isMobile = window.innerWidth < 700;
  const processedPhaseData = useState(EMPTY_ARRAY);
  
  const { caseTrackingDetails, appTrackingId, isColleagueView } = useAppTrackingHook();
  const trackingdata = caseTrackingDetails?.data;
  const phases = trackingdata?.[0]?.trackingData?.phases as unknown as PhaseType[];
  
  const { isError, updateIsError, commonStaticContent: commonContent } = useApplicationData();
  const { getCaseTrackingResult, isLoading } = useApiRequest();
  const [callApi, setCallApi] = useState(true);
  
  useEffect(() => {
    if (callApi) {
      setCallApi(false);
      getCaseTrackingResult(appTrackingId);
    }
  }, [callApi, updateIsError, isError]);
  
  if (isLoading) {
    return (
      <Grid.Container>
        <Grid.Row>
          <Grid.Col size="1of1">
            <Loading />
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    );
  }
  
  if (!appTrackingId) {
    return <ErrorPage />;
  }
  
  return (
    <>
      {isError() ? (
        <ErrorPage />
      ) : (
        <Page>
          <Grid.Container>
            <Grid.Row>
              <Grid.Col sizeSm="1of1" sizeMd="8of12" sizeLg="8of12">
                <Header />
                {trackingdata?.[0]?.applicationStatus !== EMPTY_STRING &&
                  trackingdata?.[0]?.applicationStatus !== NULL &&
                  trackingdata?.[0]?.applicationStatus !== STATUS && (
                    <Banner />
                  )}
                {trackingdata?.[0]?.applicationStatus?.toLocaleUpperCase() !== UND_STATUS && (
                  <>
                    {isColleagueView && isCancelCase(phases) && (
                      <CancelCaseWithPopUpModel />
                    )}
                    <PhasesWithStages />
                  </>
                )}
              </Grid.Col>
              <Grid.Col sizeSm="1of1" sizeMd="4of12" sizeLg="4of12">
                <Sidebar />
              </Grid.Col>
            </Grid.Row>
          </Grid.Container>
        </Page>
      )}
    </>
  );
};

export default PageLayout;
