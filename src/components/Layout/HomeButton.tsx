import SvgMafiaGrandeWithoutText from "../images/MafiaGrandeWithoutText";
export default function BackButton() {

  return (
    <a href="/">
      <button className="relative">
        <SvgMafiaGrandeWithoutText className="w-8 h-8" />
      </button>
    </a>
  );
}