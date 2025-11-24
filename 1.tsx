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
import {
  EMPTY_STRING,
  NULL,
  STATUS,
  UND_STATUS,
  EMPTY_ARRAY,
  MARGINMD,
  MARGIN2XL,
} from './utils/common.utils';

const PageLayout = () => {
  const isMobile = window.innerWidth < 700;
  const marginMd = MARGINMD;
  const margin2Xl = MARGIN2XL;
  const [processedPhaseData, setProcessedPhaseData] = useState(EMPTY_ARRAY);

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
      <Grid.Col size="1of10">
        <Loading />
      </Grid.Col>
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
        <Type
          element="span"
          data-testid="isMobile"
          style={
            isMobile
              ? { marginTop: margin2Xl, marginLeft: marginMd }
              : { marginTop: margin2Xl, marginLeft: margin2Xl }
          }
        >
          <Type
            data-testid="isMobileRight"
            style={isMobile ? { marginRight: marginMd } : {}}
            element="span"
          >
            <Grid.Col>
              <Page>
                {trackingdata?.[0]?.applicationStatus !== EMPTY_STRING &&
                  trackingdata?.[0]?.applicationStatus !== NULL &&
                  trackingdata?.[0]?.applicationStatus !== STATUS && (
                    <Grid.Col sizeSm="1of1" sizeMd="8of12" sizeLg="8of12">
                      <Header />
                      <Banner />
                    </Grid.Col>
                  )}
                {trackingdata?.[0]?.applicationStatus?.toLocaleUpperCase() !== UND_STATUS && (
                  <>
                    {isColleagueView && isCancelCase(phases) && <CancelCaseWithPopUpModel />}
                    <PhasesWithStages />
                  </>
                )}
                <Grid.Col sizeSm="1of1" sizeMd="11of12" sizeLg="4of12">
                  <Sidebar />
                </Grid.Col>
              </Page>
            </Grid.Col>
          </Type>
        </Type>
      )}
    </>
  );
};

export default PageLayout;
