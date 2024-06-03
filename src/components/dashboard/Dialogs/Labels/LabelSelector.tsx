"use client"

import AnimatedCheckIcon from "@/components/common/AnimatedCheckIcon"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Loader2 } from "lucide-react"
import { useState } from "react"

type Props = {
  entityId: Id<"notes"> | Id<"events"> | Id<"documents">;
};

export const LabelSelector = ({ entityId }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const allLabels = useQuery(api.labels.getLabels)
  const entityLabels = useQuery(api.entityLabels.getLabelsForEntity, {
    entityId,
  })
  const attachLabel = useMutation(api.entityLabels.addLabelToEntity)
  const dettachLabel = useMutation(api.entityLabels.removeLabelFromEntity)

  // Create a set of item label IDs for quick lookup
  const itemLabelIds = new Set(entityLabels?.map(label => label.labelId))

  const handleLabelClick = async (labelId: Id<"labels">) => {
    if (itemLabelIds.has(labelId)) {
      await dettachLabel({entityId, labelId})
    } else {
      await attachLabel({entityId, labelId})
    }
  }

  const filteredLabels = allLabels?.filter(label =>
    label.name.toLowerCase().includes(searchTerm)
  )

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <Input
        placeholder="Label"
        onChange={e => setSearchTerm(e.target.value.toLowerCase())}
        className="w-full rounded-lg bg-white py-4"
      />
      <div className="grid w-full grid-cols-1 gap-2">
        {filteredLabels ? (
          filteredLabels.map(label => (

            <div
            key={label._id}
              className={
                "flex items-center justify-between rounded-lg bg-white p-4 transition-all duration-300 ease-in-out hover:cursor-pointer border"
              }
              onClick={() => handleLabelClick(label._id)}
            >
              <p className="text-lg font-bold">{label.name}</p>
              {itemLabelIds.has(label._id) && <AnimatedCheckIcon />}
            </div>
         
          ))
        ) : (
          <Loader2 className="h-10 w-10 animate-spin" />
        )}
      </div>
    </div>
  )
}