import { useApp } from "../AppContext.js";
import { Button } from "./ui.jsx";

/** «تعديل الهوية»: company details are edited in one place, the account page. */
export default function EditIdentityButton() {
  const { navigate } = useApp();
  return (
    <Button variant="ghost" onClick={() => navigate("account")}>
      تعديل الهوية
    </Button>
  );
}
