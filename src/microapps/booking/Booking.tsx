import React from 'react'
import { Route, Switch } from 'react-router'
import { ColumnLayout, Responsive, View } from '@allthings/elements'
import HorizontalRouter from 'components/HorizontalRouter'
import Overview from './Overview'
import AssetList from './AssetList'
import AssetDetails from './AssetDetails'
import BookingDetail from './BookingDetail'
import MyBookingsList from './MyBookingsList'
import ChooseCategoryScreen from './ChooseCategoryScreen'
import ChooseAssetScreen from './ChooseAssetScreen'
import MyBookingsPlaceholder from './MyBookingsPlaceholder'
import { useSelector } from 'react-redux'
import { renderAssetsOnFirstPage } from 'microapps/booking/index'
import { css } from 'glamor'

const Booking = () => {
  const numberOfAssets = useSelector(
    (state: IReduxState) => state.booking.numberOfAssets,
  )

  return (
    <>
      <Responsive mobile onlyRenderOnMatch>
        {/* overflow auto needed to be able to scroll on mobile, otherwise the bottom bar flies away */}
        <View direction="column" flex="flex" {...css({ overflow: 'auto' })}>
          <HorizontalRouter
            // force a remount with the key because changing the `routes` prop does not work
            key={+renderAssetsOnFirstPage({ numberOfAssets })}
            routes={
              renderAssetsOnFirstPage({ numberOfAssets })
                ? [
                    {
                      path: '/booking',
                      component: Overview,
                    },
                    {
                      path: '/booking/assets',
                      exact: true,
                      component: AssetList,
                    },
                    {
                      path: '/booking/assets/all/:id',
                      component: AssetDetails,
                    },
                    {
                      path: '/booking/my-bookings',
                      component: MyBookingsList,
                    },
                    {
                      path: '/booking/my-bookings/:id',
                      exact: true,
                      component: BookingDetail,
                    },
                  ]
                : [
                    { path: '/booking', component: Overview },
                    {
                      path: '/booking/assets',
                      exact: true,
                      component: AssetList,
                    },
                    {
                      path: '/booking/assets/:category',
                      component: AssetList,
                    },
                    {
                      path: '/booking/my-bookings',
                      component: MyBookingsList,
                    },
                    {
                      path: '/booking/assets/:category/:id',
                      exact: true,
                      component: AssetDetails,
                    },
                    {
                      path: '/booking/my-bookings/:id',
                      exact: true,
                      component: BookingDetail,
                    },
                  ]
            }
          />
        </View>
      </Responsive>
      <Responsive desktop tablet onlyRenderOnMatch>
        <ColumnLayout>
          <HorizontalRouter
            // force a remount with the key because changing the `routes` prop does not work
            key={+renderAssetsOnFirstPage({ numberOfAssets })}
            routes={
              renderAssetsOnFirstPage({ numberOfAssets })
                ? [
                    { path: '/booking', component: Overview },
                    {
                      path: '/booking/my-bookings',
                      component: MyBookingsList,
                    },
                  ]
                : [
                    { path: '/booking', component: Overview },
                    {
                      path: '/booking/assets/:category',
                      component: AssetList,
                    },
                    {
                      path: '/booking/my-bookings',
                      component: MyBookingsList,
                    },
                  ]
            }
          />
          <Switch>
            {renderAssetsOnFirstPage({ numberOfAssets }) && (
              <Route path="/booking" exact component={ChooseAssetScreen} />
            )}
            <Route
              path="/booking/assets/:category"
              exact
              component={ChooseAssetScreen}
            />
            <Route
              path="/booking/assets/:category/:id"
              exact
              component={AssetDetails}
            />
            <Route
              path="/booking/my-bookings/:id"
              exact
              component={BookingDetail}
            />
            <Route
              path="/booking/my-bookings"
              exact
              component={MyBookingsPlaceholder}
            />
            <Route path="*" component={ChooseCategoryScreen} />
          </Switch>
        </ColumnLayout>
      </Responsive>
    </>
  )
}

export default Booking
