import React, { useEffect, useState } from "react";
import {
  Input,
  Checkbox,
  CheckboxGroup,
  ScrollShadow,
  Chip,
  cn,
} from "@nextui-org/react";
import { useInView } from "react-intersection-observer";
import movementsData from "../../../../api/movements/movements.json";

export const LazyCheckbox = ({ movement, value }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  return (
    <div ref={ref}>
      {inView && (
        <Checkbox
          aria-label={movement.name}
          classNames={{
            base: cn(
              "inline-flex max-w-full w-full bg-content1 m-0",
              "hover:bg-content2 items-center justify-start",
              "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
              "data-[selected=true]:border-primary"
            ),
            label: "w-full",
          }}
          value={value}
        >
          <div className="w-full flex justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">{movement.name}</h3>
              {
                <div>
                  <div>
                    <Chip color="primary" variant="light">
                      Equipment: {movement.equipment || "N/A"}
                    </Chip>
                  </div>
                  <div>
                    <Chip color="secondary" variant="light">
                      Level: {movement.level || "N/A"}
                    </Chip>
                  </div>
                </div>
              }
            </div>
            <div className="flex flex-col items-end gap-1">
              {movement.primaryMuscles && (
                <Chip color="warning" size="md" variant="flat">
                  {movement.primaryMuscles}
                </Chip>
              )}
            </div>
          </div>
        </Checkbox>
      )}
    </div>
  );
};

function MovementsCheckboxes({ setWorkoutTitle = () => {},  setMovementsChecked = () => {} }) {
  const [groupSelected, setGroupSelected] = useState([]);
  const [titleValue, setTitleValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  let filteredItems = movementsData;

  useEffect(() => {
    if (groupSelected.length < 1) {
      return;
    }
    setMovementsChecked(groupSelected);
  }, [groupSelected]);

  filteredItems = movementsData.movements.filter(item =>
    searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : movementsData.movements
  );

  const handleCheckboxChange = (id) => {
    setGroupSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };


  useEffect(() => {
    setWorkoutTitle(titleValue);
  }, [titleValue]);

  return (
    <>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-8 items-start">
        <Input
          isRequired
          classNames={{
            mainWrapper: "h-full pb-0",
            input:
              "pb-0 text-md border-transparent focus:border-transparent focus:ring-0",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          label="Workout Title"
          type="text"
          value={titleValue}
          onValueChange={setTitleValue}
        />
      </div>
      <div className="flex flex-col gap-1 w-full">
      <Input
          classNames={{
            mainWrapper: "h-full pb-0",
            input:
              "pb-0 text-md border-transparent focus:border-transparent focus:ring-0",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          label="Search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ScrollShadow
          orientation="vertical"
          className="w-full max-w-full h-[400px] overflow-y-auto shadow-md"
        >
          <CheckboxGroup
            classNames={{
              base: "w-full mb-6",
            }}
            label="Select exercises"
            value={groupSelected}
            onChange={setGroupSelected}
          >
            {filteredItems.map((movement, index) => (
              <LazyCheckbox
                key={index}
                movement={movement}
                value={movement.name}
              />
            ))}
          </CheckboxGroup>
        </ScrollShadow>
        {groupSelected.length > 0 && (
          <h3 className="text-lg font-semibold mb-8">
            Selected:{" "}
            <span className="mt-4 ml-1 text-default-500">
              {groupSelected.join(", ")}
            </span>
          </h3>
        )}
      </div>
    </>
  );
}

export default MovementsCheckboxes;
