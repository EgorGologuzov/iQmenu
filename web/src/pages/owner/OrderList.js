import React, { useState } from 'react'
import OwnerNavBar from '../../components/navs/OwnerNavBar';
import withStackContainerShell from '../../hoc/withStackContainerShell';
import useTitle from '../../hooks/useTitle';

function MenuList() {

	useTitle({ general: "Заказы по вашим меню" }, []);

  return (
    <>
			<OwnerNavBar />
    </>
  )
}

export default withStackContainerShell(MenuList)