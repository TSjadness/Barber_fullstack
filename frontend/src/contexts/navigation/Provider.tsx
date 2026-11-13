import { useCallback, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { emptyFlow, NavigationContext, type BookingEntry, type NavigationValue } from "./context";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import type { AdminSection, AuthMode, StartView, View } from "@/types/app";
import type { BookingFlow, BookingStep } from "@/types/barber";
import { todayIso } from "@/utils/date";

interface NavigationProviderProps {
  startView: StartView;
  children: ReactNode;
}

const currentMonth = () => todayIso().slice(0, 7);

export function NavigationProvider({ startView: initialStart, children }: NavigationProviderProps) {
  const [view, setViewState] = useState<View>(
    initialStart === "admin" || initialStart === "reset-link" ? "admin" : "public",
  );
  const [section, setSectionState] = useState<AdminSection>("overview");
  const [authMode, setAuthMode] = useState<AuthMode>(
    initialStart === "reset-link" ? "reset" : "login",
  );
  const [resetEmail, setResetEmail] = useState("");
  const [startView, setStartView] = useState<StartView>(initialStart);
  const [bookingMonth, setBookingMonth] = useState(currentMonth);
  const [bookingEntry, setBookingEntry] = useState<BookingEntry>({
    flow: emptyFlow(),
    step: 1,
    id: 0,
  });
  const menu = useMobileMenu();
  const { close: closeMobileMenu } = menu;

  // Volta ao topo depois que a nova tela foi desenhada.
  const scrollPending = useRef(false);
  const [navigationId, setNavigationId] = useState(0);
  useLayoutEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    window.scrollTo(0, 0);
  }, [navigationId]);
  const scrollToTop = useCallback(() => {
    scrollPending.current = true;
    setNavigationId((n) => n + 1);
  }, []);

  const setView = useCallback(
    (next: View) => {
      if (next !== "admin") closeMobileMenu();
      setViewState(next);
    },
    [closeMobileMenu],
  );
  const go = useCallback(
    (next: View) => {
      closeMobileMenu();
      setViewState(next);
      scrollToTop();
    },
    [closeMobileMenu, scrollToTop],
  );
  const setSection = useCallback(
    (next: AdminSection) => {
      closeMobileMenu();
      setSectionState(next);
    },
    [closeMobileMenu],
  );

  const enterBooking = useCallback(
    (flow: BookingFlow, step: BookingStep) => {
      setBookingEntry((entry) => ({ flow, step, id: entry.id + 1 }));
      setView("booking");
      scrollToTop();
    },
    [setView, scrollToTop],
  );
  const newBooking = useCallback(() => {
    setBookingMonth(currentMonth());
    enterBooking(emptyFlow(), 1);
  }, [enterBooking]);
  const startBooking = useCallback(
    (serviceId: string) => enterBooking(emptyFlow({ serviceIds: [serviceId] }), 2),
    [enterBooking],
  );
  const chooseProfessional = useCallback(
    (staffId: string) => enterBooking(emptyFlow({ staffId }), 1),
    [enterBooking],
  );

  const value = useMemo<NavigationValue>(
    () => ({
      view,
      section,
      authMode,
      resetEmail,
      startView,
      bookingEntry,
      bookingMonth,
      mobileMenuOpen: menu.open,
      go,
      setView,
      setSection,
      setAuthMode,
      setResetEmail,
      setStartView,
      setBookingMonth,
      newBooking,
      startBooking,
      chooseProfessional,
      toggleMobileMenu: menu.toggle,
      closeMobileMenu,
    }),
    [
      view,
      section,
      authMode,
      resetEmail,
      startView,
      bookingEntry,
      bookingMonth,
      menu.open,
      menu.toggle,
      go,
      setView,
      setSection,
      newBooking,
      startBooking,
      chooseProfessional,
      closeMobileMenu,
    ],
  );
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
