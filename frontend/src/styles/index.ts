import { createGlobalStyle } from "styled-components";
import { themeCss } from "./theme";
import { animationsCss } from "./animations";
import { globalCss } from "./global";
import { headerStyles } from "@/components/Header/styles";
import { buttonStyles } from "@/components/Button/styles";
import { publicStyles } from "@/pages/Public/styles";
import { serviceCardStyles } from "@/components/ServiceCard/styles";
import { cardStyles } from "@/components/Card/styles";
import { chipStyles } from "@/components/Chip/styles";
import { emptyStateStyles } from "@/components/EmptyState/styles";
import { teamCardStyles } from "@/components/TeamCard/styles";
import { avatarStyles } from "@/components/Avatar/styles";
import { footerStyles } from "@/components/Footer/styles";
import { adminLayoutStyles } from "@/pages/Admin/styles";
import { sidebarStyles } from "@/components/Sidebar/styles";
import { pageHeadStyles } from "@/components/PageHead/styles";
import { financeStyles } from "@/pages/Admin/Finance/styles";
import { dataTableStyles } from "@/components/DataTable/styles";
import { statusBadgeStyles } from "@/components/StatusBadge/styles";
import { agendaStyles } from "@/pages/Admin/Agenda/styles";
import { monthCalendarStyles } from "@/components/MonthCalendar/styles";
import { bookingStyles } from "@/pages/Booking/styles";
import { noticeBoxStyles } from "@/components/NoticeBox/styles";
import { formStyles } from "@/components/Form/styles";
import { noticesStyles } from "@/pages/Admin/Notices/styles";
import { manageRowStyles } from "@/components/ManageRow/styles";
import { timeSlotsStyles } from "@/components/TimeSlots/styles";
import { summaryBoxStyles } from "@/components/SummaryBox/styles";
import { modalStyles } from "@/components/Modal/styles";
import { hoursStyles } from "@/pages/Admin/Hours/styles";
import { loadingOverlayStyles } from "@/components/LoadingOverlay/styles";
import { switchStyles } from "@/components/Switch/styles";
import { overviewStyles } from "@/pages/Admin/Overview/styles";
import { iconStyles } from "@/components/Icon/styles";
import { photoZoomStyles } from "@/components/PhotoZoom/styles";
import { staffEditorStyles } from "@/pages/Admin/Staff/StaffEditor/styles";
import { filterBarStyles } from "@/components/FilterBar/styles";
import { loginStyles } from "@/pages/Login/styles";
import { calendarStyles } from "@/pages/Admin/Calendar/styles";
import { settingsStyles } from "@/pages/Admin/Settings/styles";
import { staffStyles } from "@/pages/Admin/Staff/styles";
import { confirmDialogStyles } from "@/components/ConfirmDialog/styles";
import { servicesStyles } from "@/pages/Admin/Services/styles";
import { rowActionsStyles } from "@/components/RowActions/styles";
import { clientsStyles } from "@/pages/Admin/Clients/styles";
import { paginationStyles } from "@/components/Pagination/styles";
import { lightThemeStyles } from "./lightTheme";

/**
 * Base visual (tokens, keyframes, reset e tipografia). É inserida no <head> pelas rotas
 * para valer já no HTML do servidor, antes da hidratação: fundo escuro, fontes e o
 * indicador de carregamento aparecem sem "piscar".
 */
export const baseCss = [themeCss, animationsCss, globalCss].join("\n");

/**
 * Estilos de componentes e páginas.
 *
 * A ORDEM IMPORTA: os módulos são compostos na mesma sequência de cascata do antigo
 * app.css. Quando duas regras de módulos diferentes têm a mesma especificidade e
 * atingem o mesmo elemento, a que vem depois vence; esta ordem foi validada para que
 * nenhuma dessas disputas mude de resultado. Ao criar um módulo novo, adicione-o
 * conforme a especificidade e as sobreposições que ele precisa vencer.
 */
export const GlobalStyle = createGlobalStyle`
  ${headerStyles}
  ${buttonStyles}
  ${publicStyles}
  ${serviceCardStyles}
  ${cardStyles}
  ${chipStyles}
  ${emptyStateStyles}
  ${teamCardStyles}
  ${avatarStyles}
  ${footerStyles}
  ${adminLayoutStyles}
  ${sidebarStyles}
  ${pageHeadStyles}
  ${financeStyles}
  ${dataTableStyles}
  ${statusBadgeStyles}
  ${agendaStyles}
  ${monthCalendarStyles}
  ${bookingStyles}
  ${noticeBoxStyles}
  ${formStyles}
  ${noticesStyles}
  ${manageRowStyles}
  ${timeSlotsStyles}
  ${summaryBoxStyles}
  ${modalStyles}
  ${hoursStyles}
  ${loadingOverlayStyles}
  ${switchStyles}
  ${overviewStyles}
  ${iconStyles}
  ${photoZoomStyles}
  ${staffEditorStyles}
  ${filterBarStyles}
  ${loginStyles}
  ${calendarStyles}
  ${settingsStyles}
  ${staffStyles}
  ${confirmDialogStyles}
  ${servicesStyles}
  ${rowActionsStyles}
  ${clientsStyles}
  ${paginationStyles}
  ${lightThemeStyles}
`;
