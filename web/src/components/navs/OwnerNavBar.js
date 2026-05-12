import { Button, ButtonGroup, Tooltip } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChecklistIcon from "@mui/icons-material/Checklist";

function OwnerNavBar() {

	const navigate = useNavigate();
	const location = useLocation();

	const currentButton = 
		location.pathname?.endsWith("menu") ? "menus" :
		location.pathname?.endsWith("order") ? "orders" :
		null;

	return (
		<ButtonGroup sx={{ width: "100%" }}>
			<Tooltip title="Меню">
				<Button
					startIcon={<ReceiptLongIcon />}
					variant={currentButton === "menus" ? "contained" : "outlined"}
					onClick={() => navigate("/o/menu")}
					sx={{ flexGrow: 1 }}
				>
					Меню
				</Button>
			</Tooltip>
			<Tooltip title="Заказы">
				<Button
					startIcon={<ChecklistIcon />}
					variant={currentButton === "orders" ? "contained" : "outlined"}
					onClick={() => navigate("/o/order")}
					sx={{ flexGrow: 1 }}
				>
					Заказы
				</Button>
			</Tooltip>
		</ButtonGroup>
	)
}

export default OwnerNavBar;