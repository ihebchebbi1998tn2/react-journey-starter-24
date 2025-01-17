import React from 'react';
import SubMenuSection from '../../navigation/SubMenuSection';

const PretAPorterSection = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SubMenuSection
        title="Homme"
        items={[
          {
            href: "/category/pret-a-porter/homme/costumes",
            title: "Costumes",
            description: "Costumes élégants",
            image: "/Pcis/costumes.png"
          },
          {
            href: "/category/pret-a-porter/homme/blazers",
            title: "Blazers",
            description: "Blazers raffinés",
            image: "/Pcis/blazers.png"
          },
          {
            href: "/category/pret-a-porter/homme/chemises",
            title: "Chemises",
            description: "Chemises classiques",
            image: "/Pcis/chemisehomme.png"
          },
          {
            href: "/category/pret-a-porter/homme/pantalons",
            title: "Pantalons",
            description: "Pantalons élégants",
            image: "/Pcis/PontallonHomme.png"
          },
          {
            href: "/category/pret-a-porter/homme/pollo",
            title: "Pollo",
            description: "Polos élégants",
            image: "/Pcis/pull.png"
          }
        ]}
      />
      <SubMenuSection
        title="Femme"
        items={[
          {
            href: "/category/pret-a-porter/femme/chemises",
            title: "Chemises",
            description: "Chemises féminines",
            image: "/Pcis/chemisefemme.png"
          },
          {
            href: "/category/pret-a-porter/femme/robes",
            title: "Robes",
            description: "Robes élégantes",
            image: "/Pcis/robe.png"
          },
          {
            href: "/category/pret-a-porter/femme/vestes",
            title: "Vestes/Manteaux",
            description: "Vestes et manteaux",
            image: "/Pcis/VestesFemme.png"
          }
        ]}
      />
    </div>
  );
};

export default PretAPorterSection;